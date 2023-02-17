<script lang="ts" setup>
import { getFromIdApi } from '/@/api/admin'
import { getPermissionsApi, Permission, putPermissionApi } from '/@/api/permission'
import IconButton from '/@/components/iconButton/index.vue'
import { refEl } from '/@/utils'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage, ElTable } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

// const router = useRouter()
const route = useRoute()
const tableEl = refEl(ElTable)

const form = reactive({
  nickname: '',
  photo: '',
  adminId: 0,
  permissions: [] as string[],
})

const permissions = ref([] as Permission[])
const permissionsLoading = ref(false)
const permissionChcked = ref(false)

const getForm = async () => {
  const adminId = route.query.adminId as string
  const { data } = await getFromIdApi({ adminId })
  Object.assign(form, data.data)
  if(isSuperAdmin.value) return
  form.permissions.forEach(permission => {
    tableEl.value!.toggleRowSelection(permissions.value.find(e => e.permissionId === permission), true)
  })
}

const getPermissions = async () => {
  permissionsLoading.value = true
  const { data } = await getPermissionsApi()
  permissions.value = data.data
  permissionsLoading.value = false
  await getForm()
  permissionChcked.value = false
}

const selectionChange = (selected: Permission[]) => {
  permissionChcked.value = true
  form.permissions = selected.map(permission => permission.permissionId)
}

const isSuperAdmin = computed(() => form.permissions && form.permissions.includes('superAdmin'))

const superAdmin = () => {
  if(isSuperAdmin.value) {
    ElMessage.warning('该账户为超级管理员，不可编辑')
  }
}

const submit = async () => {
  permissionChcked.value = false
  const { adminId, permissions } = form
  const { data, status } = await putPermissionApi({ adminId, permissions })
  if(status === 200) {
    ElMessage.success('修改成功')
  } else {
    permissionChcked.value = true
  }
}

onMounted(() => {
  getPermissions()
})

</script>

<template>
  <div class="p8">
    <el-descriptions title="管理员信息">
      <el-descriptions-item class="p8" label="用户名:">{{ form.nickname }}</el-descriptions-item>
      <el-descriptions-item class="p8" label="头像:"><img :src="form.photo" class="preview-image">
      </el-descriptions-item>
    </el-descriptions>
    <el-table ref="tableEl" :data="permissions" @click="superAdmin"
              @selectionChange="selectionChange">
      <el-table-column v-if="!isSuperAdmin" type="selection" width="55"/>
      <el-table-column label="权限" prop="description"></el-table-column>
      <el-table-column prop="permissionId">
        <template v-slot:header>
          <div class="cell">
            符号
            <div class="right">
              <IconButton :disabled="!permissionChcked" :icon="Upload" type="primary" tooltip="上传"
                          @click="submit"/>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.right {
  float: right;
}
</style>
<script lang="ts">
export default { name: 'permission' }
</script>
