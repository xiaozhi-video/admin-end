<script lang="ts" setup>
import { AdminListInfo, getListApi, removeAdminApi } from '/@/api/admin'
import { getClassifyListApi } from '/@/api/classify'
import { getPermissionsApi, PermissionInfo } from '/@/api/permission'
import { PageParams } from '/@/api/user'
import IconButton from '/@/components/iconButton/index.vue'
import Table from '/@/components/table/index.vue'
import { refEl } from '/@/utils'
import AccountForm from '/@/views/adminer/components/AccountForm.vue'
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tableEl = refEl(Table)

const tableOptions = reactive({
  data: [] as AdminListInfo[],
  param: {
    pageNumber: 1,
    pageSize: 10,
  },
  header: [
    {
      key: 'photo',
      title: '头像',
      type: 'image',
      isCheck: true,
      colWidth: '100px',
    },
    {
      key: 'nickname',
      title: '昵称',
      type: 'text',
      isCheck: true,
    },
    {
      key: 'permissionsDescription',
      title: '权限',
      isCheck: true,
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

const query = reactive({
  keyWord: '',
  permission: '',
})

const getList = async (page: PageParams) => {
  tableOptions.config.loading = true
  const { data } = await getListApi({ ...page, ...query })
  tableOptions.data = data.data
  tableOptions.config.total = data.total
  tableOptions.config.loading = false
}

const permissionList = ref<PermissionInfo[]>([])

const getPermissionList = async () => {
  const { data } = await getPermissionsApi()
  permissionList.value = data.data
}

onMounted(() => {
  getPermissionList()
})

const delAdmin = async ({ adminId, permissions }: AdminListInfo) => {
  if(permissions.includes('superAdmin')) {
    ElMessage.error('该账号为超级管理员，不可操作')
    return
  }
  const { status } = await removeAdminApi({ adminId })
  if(status === 200) {
    ElMessage.success('删除成功')
    tableEl.value.pageReset()
  }
}

const getPD = (value: string[]) => {
  if(value.includes('超级管理员')) return '超级管理员'
  if(value.length === 0) return '无管理权限'
  if(value.length <= 3) return value.join('、')
  return `${ value.slice(0, 3).join('、') } 等${ value.length - 1 }个权限`
}

const edit = (row: AdminListInfo) => {
  router.push({
    name: 'adminerEdit',
    query: {
      adminId: row.adminId,
    },
  })
}

const showAddWin = ref(false)

</script>

<template>
  <div class="p8">
    <Table ref="tableEl" v-bind="tableOptions" @getDate="getList"
           @sortHeader="tableOptions.header = $event">
      <template v-slot:operate="{row}">
        <div class="cell">
          <IconButton :icon="Edit" tooltip="编辑" type="primary" @click="edit(row)"/>
          <el-popconfirm title="确定删除该用户？该操作不可撤销！" @confirm="delAdmin(row)">
            <template v-slot:reference>
              <span class="ml12">
                <IconButton :icon="Delete" tooltip="删除" type="danger"></IconButton>
              </span>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <template v-slot:permissionsDescription="{row}">
        {{ getPD(row.permissionsDescription) }}
      </template>
      <template v-slot:footerButton>
        <IconButton :icon="CirclePlus" text tooltip="添加" @click="showAddWin = true"/>
      </template>
      <!--   搜索   -->
      <template #nicknameHeader>
        <el-input v-model="query.keyWord" placeholder="搜索" @keyup.enter="tableEl.flushed()">
          <template #prepend>昵称</template>
        </el-input>
      </template>
      <!--   权限过滤   -->
      <template #permissionsDescriptionHeader>
        <div class="filter-box">
          <el-select v-model="query.permission" class="filter-select" clearable filterable
                     placeholder="选择权限" @change="tableEl.flushed()">
            <el-option v-for="item in permissionList" :key="item.permissionId" :label="item.description"
                       :value="item.permissionId">
            </el-option>
          </el-select>
        </div>
      </template>
    </Table>
    <el-dialog v-model="showAddWin" width="360px">
      <AccountForm/>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
</style>
<script lang="ts">
export default { name: 'list' }
</script>
