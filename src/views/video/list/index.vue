<script lang="ts" setup>
import { ClassifyInfo, getClassifyListApi } from '/@/api/classify'
import { PageParams } from '/@/api/user'
import { getVideoApi, unpushApi, VideoInfo } from '/@/api/video'
import IconButton from '/@/components/iconButton/index.vue'
import Table from '/@/components/table/index.vue'
import { Download, VideoCameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const tableEl = ref<InstanceType<typeof Table>>()

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
      colWidth: '210px',
    },
    {
      key: 'state',
      title: '状态',
      isCheck: true,
    },
    {
      key: 'createdAt',
      title: '提交时间',
      isCheck: true,
      type: 'date',
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
    isSerialNo: false, // 是否显示表格序号
    isSelection: true, // 是否显示表格多选
    isOperate: true, // 是否显示表格操作栏
    operateWidth: '160px',
  },
})

const classifyList = ref<ClassifyInfo[]>([])

const stateList = [
  { label: '草稿', value: 0 },
  { label: '待审核', value: 1 },
  { label: '已发布', value: 2 },
]

const query = reactive({
  keyWord: '',
  classify: '',
  state: undefined,
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

const unpush = async (row: VideoInfo) => {
  const { status } = await unpushApi({ videoId: row.videoId })
  if(status === 200) {
    ElMessage.success('已下架')
  }
}

function stateChange(val: number | '') {
  if(val === '') {
    query.state = undefined
  }
  tableEl.value.flushed()
}

function toPlay(videoId: string) {
  router.push({
    name: 'videoPlay',
    query: {
      videoId
    }
  })
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
      <template v-slot:operate="{row}">
        <div class="cell">
          <IconButton :disabled="row.state < 2" :icon="Download" tooltip="取消发布"
                      @click="unpush(row)"/>
          <IconButton :icon="VideoCameraFilled" tooltip="前往播放"
                      @click="toPlay(row.videoId)"/>
        </div>
      </template>
      <!--   状态   -->
      <template v-slot:state="{row}">
        <el-tag v-if="row.state === 0" type="info">草稿</el-tag>
        <el-tag v-else-if="row.state === 1" type="warning">待审核</el-tag>
        <el-tag v-else-if="row.state === 2" type="success">已发布</el-tag>
      </template>
      <!--   搜索   -->
      <template #titleHeader>
        <el-input v-model="query.keyWord" placeholder="搜索" @keyup.enter="tableEl.flushed()">
          <template #prepend>标题</template>
        </el-input>
      </template>
      <!--   分类过滤   -->
      <template #classifyHeader>
        <div class="filter-box">
          <el-select v-model="query.classify" class="filter-select" clearable filterable
                     @change="tableEl.flushed()" placeholder="选择分类">
            <el-option v-for="item in classifyList" :key="item.name" :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </div>
      </template>
      <!--   状态过滤   -->
      <template #stateHeader>
        <div class="filter-box">
          <el-select v-model="query.state" class="filter-select" clearable filterable
                     @change="stateChange" placeholder="选择状态">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
    </Table>
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
</style>
<script lang="ts">
export default { name: 'list' }
</script>
