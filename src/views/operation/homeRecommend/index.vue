<script lang="ts" setup>
import { ClassifyInfo, getClassifyListApi } from '/@/api/classify'
import { PageParams } from '/@/api/user'
import { getRanking, getVideoApi, putRecommend, VideoInfo } from '/@/api/video'
import IconButton from '/@/components/iconButton/index.vue'
import Table from '/@/components/table/index.vue'
import { refEl } from '/@/utils'
import { Bottom, Sort, SortDown, SortUp, Upload, VideoCameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tableEl = refEl(Table)

const tableOptions = reactive({
  data: [] as VideoInfo[],
  param: {
    pageNumber: 1,
    pageSize: 10,
  },
  header: [
    {
      key: 'title',
      title: '标题',
      type: 'text',
      isCheck: true,
      colWidth: '260px',
    },
    {
      key: 'describe',
      title: '描述',
      type: 'text',
      isCheck: false,
    },
    {
      key: 'cover',
      title: '封面',
      type: 'image',
      isCheck: true,
      colWidth: '150px',
      width: '112px',
      height: '63px',
    },
    {
      key: 'classify',
      title: '分类',
      isCheck: true,
      type: 'text',
      colWidth: '200px',
    },
    {
      key: 'createdAt',
      title: '提交时间',
      isCheck: false,
      type: 'date',
    },
    {
      key: 'recommend',
      title: '推荐权重',
      isCheck: true,
    },
    {
      key: 'likeCount',
      title: '点赞量',
      type: 'text',
      isCheck: false,
      colWidth: '100px',
    },
    {
      key: 'readCount',
      title: '浏览量',
      type: 'text',
      isCheck: false,
      colWidth: '100px',
    },
    {
      key: 'sortValue',
      title: '排序指数',
      type: 'text',
      isCheck: true,
    },
    {
      key: 'author',
      title: '作者',
      isCheck: false,
      type: 'text',
      formatter(row: any) {
        return row.user.nickname
      },
    },
  ],
  config: {
    total: 0, // 列表总数
    loading: false, // loading 加载
    isBorder: false, // 是否显示表格边框
    isSerialNo: true, // 是否显示表格序号
    isSelection: false, // 是否显示表格多选
    isOperate: true, // 是否显示表格操作栏
    operateWidth: '160px',
  },
})

const classifyList = ref<ClassifyInfo[]>([])

const query = reactive({
  keyWord: '',
  classify: '',
  state: 2,
})

const getList = async (page: PageParams) => {
  tableOptions.config.loading = true
  const { data } = await getVideoApi({ ...page, ...query })
  tableOptions.data = data.data
  tableOptions.config.total = data.total
  tableOptions.config.loading = false
}

const getClassify = async () => {
  const { data } = await getClassifyListApi()
  classifyList.value = data.data
}

function toPlay(videoId: string) {
  router.push({
    name: 'videoPlay',
    query: {
      videoId,
    },
  })
}

const showEdit = ref(false)
const form = reactive<Pick<VideoInfo, 'videoId' | 'readCount' | 'recommend' | 'likeCount'>>({
  likeCount: 0,
  readCount: 0,
  videoId: '',
  recommend: 100,
})

// 修改推荐指数、计算排序指数、预测排名

const sortValue = computed(() => (((form.readCount * 0.5 + form.likeCount + 1) * form.recommend) / 100))

const sortValueVariation = computed(() => sortValue.value - oldForm.sortValue)
const rankingVariation = computed(() => outcome.ranking - oldForm.ranking)

const oldForm = reactive<Pick<VideoInfo, 'sortValue' | 'recommend'> & { ranking: number }>({
  sortValue: 100,
  recommend: 100,
  ranking: 1,
})

const outcome = reactive({
  ranking: 0,
})

function edit(prop: { row: VideoInfo, page: { pageNumber: number, pageSize: number }, $index: number }) {
  const { row } = prop
  showEdit.value = true
  form.videoId = row.videoId
  form.recommend = row.recommend
  form.readCount = row.readCount
  form.likeCount = row.likeCount
  oldForm.recommend = row.recommend
  oldForm.sortValue = row.sortValue
  const { page: { pageNumber, pageSize }, $index } = prop
  oldForm.ranking = outcome.ranking = (pageNumber - 1) * (pageSize) + $index + 1
}

const forecast = async () => {
  const { data, status } = await getRanking({ sortValue: sortValue.value })
  if(status === 200) {
    outcome.ranking = data.data
  }
}

const loading = ref(false)

const submit = async () => {
  loading.value = true
  const { data, status } = await putRecommend({ videoId: form.videoId, recommend: form.recommend })
  loading.value = false
  if (status === 200) {
    ElMessage.success('已提交')
    showEdit.value = false
    tableEl.value!.flushed()
  }
}

onMounted(() => {
  getClassify()
})

</script>

<template>
  <div class="p8">
    <Table ref="tableEl" v-bind="tableOptions" @getDate="getList"
           @sortHeader="tableOptions.header = $event">
      <!--  操作    -->
      <template v-slot:operate="prop">
        <div class="cell">
          <IconButton :icon="Sort" tooltip="编辑" @click="edit(prop)"/>
          <IconButton :icon="VideoCameraFilled" tooltip="前往播放"
                      @click="toPlay(prop.row.videoId)"/>
        </div>
      </template>
      <!--   搜索   -->
      <template #titleHeader>
        <el-input v-model="query.keyWord" placeholder="搜索" @keyup.enter="tableEl.flushed()">
          <template #prepend>标题</template>
        </el-input>
      </template>
      <!--   推荐指数   -->
      <template v-slot:recommend="{row}">
        <span class="mid">
        {{ row.recommend.toFixed(2) }}
          &nbsp;
        <el-icon v-if="row.recommend < 100" color="var(--el-color-danger)" size="16">
          <SortDown/>
        </el-icon>
        <el-icon v-else-if="row.recommend > 100" color="var(--el-color-success)" size="16">
          <SortUp/>
        </el-icon>
        </span>
      </template>
      <!--   分类过滤   -->
      <template #classifyHeader>
        <div class="filter-box">
          <el-select v-model="query.classify" class="filter-select" clearable filterable
                     placeholder="选择分类" @change="tableEl.flushed()">
            <el-option v-for="item in classifyList" :key="item.name" :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </div>
      </template>
    </Table>
    <el-dialog v-model="showEdit" width="280px">
      <div class="sort-edit" v-loading="loading">
        <el-form :model="form" class="l" inline title="推荐指数">
          <el-form-item label="推荐指数" prop="recommend">
            <el-input-number v-model="form.recommend"></el-input-number>
          </el-form-item>
          <el-form-item id="m0" label="排序指数">
            {{ sortValue.toFixed(2) }}
            <span v-show="sortValueVariation !== 0" class="svv ml6">
              <el-icon v-if="sortValueVariation < 0" color="var(--el-color-danger)" size="14"><SortDown/></el-icon>
              <el-icon v-else-if="sortValueVariation > 0" color="var(--el-color-success)" size="14"><SortUp/></el-icon>
              <span>{{ Math.abs(sortValueVariation).toFixed(2) }}</span>
            </span>
          </el-form-item>
        </el-form>
        <IconButton :icon="Bottom" tooltip="预测" @click="forecast"/>
        <el-descriptions class="mt16 mb16">
          <el-descriptions-item label="排名:">
            <span class="svv">
              {{ outcome.ranking }}
              <span v-show="rankingVariation !== 0" class="svv ml6">
                <el-icon v-if="rankingVariation > 0" color="var(--el-color-danger)" size="14"><SortDown/></el-icon>
                <el-icon v-else-if="rankingVariation < 0" color="var(--el-color-success)" size="14"><SortUp/></el-icon>
                <span>{{ Math.abs(rankingVariation) }}</span>
              </span>
            </span>
          </el-descriptions-item>
        </el-descriptions>
        <el-button :icon="Upload" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.preview-image) {
  width: 112px;
  height: 63px;
}

.filter-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-title {
  flex-shrink: 0;
}

.filter-select {
  margin-left: 6px;
}

.mid {
  display: flex;
  align-items: center;
}

.sort-edit {
  display: flex;
  align-items: center;
  flex-direction: column;

  .svv {
    display: inline-flex;
    align-items: center;
  }
}
</style>
<script lang="ts">
export default { name: 'homeRecommend' }
</script>
