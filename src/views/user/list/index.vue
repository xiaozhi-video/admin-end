<script lang="ts" setup>
import { getUserList, PageParams, putUserBanned, UserInfo } from '/@/api/user'
import IconButton from '/@/components/iconButton/index.vue'
import Table from '/@/components/table/index.vue'
import { SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const tableEl = ref<InstanceType<typeof Table>>()

const tableOptions = reactive({
  data: [] as UserInfo[],
  param: {
    pageNumber: 1,
    pageSize: 10,
  },
  header: [
    {
      key: 'nickname',
      title: '用户名',
      type: 'text',
      isCheck: true,
    },
    {
      key: 'signature',
      title: '个签',
      isCheck: true,
      type: 'text',
    },
    {
      key: 'avatar',
      title: '头像',
      type: 'image',
      isCheck: true,
      colWidth: '100px',
    },
    {
      key: 'banned',
      title: '状态',
      isCheck: true,
      colWidth: '160px',
    },
    {
      key: 'createdAt',
      title: '注册时间',
      isCheck: true,
      type: 'date',
    },
  ],
  config: {
    total: 0, // 列表总数
    loading: false, // loading 加载
    isBorder: false, // 是否显示表格边框
    isSerialNo: false, // 是否显示表格序号
    isSelection: true, // 是否显示表格多选
    isOperate: true, // 是否显示表格操作栏
    operateWidth: '100px',
  },
})

const query = reactive({
  banned: undefined as number | undefined,
  keyWord: '',
})

const getList = async (page: PageParams) => {
  tableOptions.config.loading = true
  const { data } = await getUserList({ ...page, ...query })
  tableOptions.data = data.data
  tableOptions.config.total = data.total
  tableOptions.config.loading = false
}

const banned = async (row: UserInfo, banned: number) => {
  const { status } = await putUserBanned({ userId: row.userId, banned })
  if(status === 200) {
    if(banned) {
      ElMessage.success('已封禁')
    } else {
      ElMessage.success('已解封')
    }
    tableEl.value!.flushed()
  }
}

function bannedChange(val: number | '') {
  if(val === '') {
    query.banned = undefined
  }
  tableEl.value.flushed()
}

</script>

<template>
  <div class="p8">
    <Table ref="tableEl" v-bind="tableOptions" @getDate="getList"
           @sortHeader="tableOptions.header = $event">
      <!--  操作    -->
      <template v-slot:operate="{row}">
        <div class="cell">
          <el-popconfirm v-if="row.banned" title="确定封禁该用户？" @confirm="banned(row, 0)">
            <template v-slot:reference>
              <span>
                <IconButton :icon="SuccessFilled" tooltip="解封" type="success"/>
              </span>
            </template>
          </el-popconfirm>
          <el-popconfirm v-else title="确定解封该用户？" @confirm="banned(row, 1)">
            <template v-slot:reference>
              <span>
                <IconButton :icon="WarningFilled " tooltip="封禁" type="danger"/>
              </span>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <!--   搜索   -->
      <template #nicknameHeader>
        <el-input v-model="query.keyWord" placeholder="搜索" @keyup.enter="tableEl.flushed()">
          <template #prepend>用户名</template>
        </el-input>
      </template>
      <!--   状态过滤   -->
      <template #bannedHeader>
        <div class="filter-box">
          <el-select v-model="query.banned" class="filter-select" clearable filterable
                     @change="bannedChange" placeholder="选择状态">
            <el-option :value="0" label="未封禁"></el-option>
            <el-option :value="1" label="已封禁"></el-option>
          </el-select>
        </div>
      </template>
      <!--   状态   -->
      <template v-slot:banned="{row}">
        <el-tag v-if="row.banned === 0" type="info">正常</el-tag>
        <el-tag v-else-if="row.banned === 1" type="danger">已封禁</el-tag>
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped>
.filter-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-title {
  flex-shrink: 0;
}
</style>

<script lang="ts">
export default { name: 'list' }
</script>
