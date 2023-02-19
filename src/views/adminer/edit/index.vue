<script lang="ts" setup>
import { getFromIdApi, resetPassApi } from '/@/api/admin'
import { getPermissionsApi, Permission, putPermissionApi } from '/@/api/permission'
import IconButton from '/@/components/iconButton/index.vue'
import { refEl } from '/@/utils'
import { toOriginal } from '/@/utils/image'
import { RefreshRight, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
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

const loading = ref(true)

const getForm = async () => {
  loading.value = true
  const adminId = route.query.adminId as string
  const { data, status } = await getFromIdApi({ adminId: +adminId })
  if(status === 405) {
    ElMessage.error('资源不存在')
  }
  Object.assign(form, data.data)
  loading.value = false
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

const resetPass = async () => {
  const { data, status } = await resetPassApi({ adminId: form.adminId })
  if(status === 200) {
    ElMessageBox.alert(`以下内容只会显示一次，请立即保存您的新密码：\n${ data.password }`, '密码已重置')
  }
}

onMounted(() => {
  getPermissions()
})

</script>

<template>
  <div class="p8">
    <el-skeleton animated :loading="loading">
      <template #template>
        <el-descriptions :column="3" title="管理员信息">
          <el-descriptions-item class="p8" label="用户名:" width="33%">
            <el-skeleton-item class="inline" variant="text" style="width: calc(100% - 80px);"/>
          </el-descriptions-item>
          <el-descriptions-item class="p8" label="头像:" width="33%">
            <el-skeleton-item class="inline" variant="image" style="width: 64px;height: 64px;"/>
          </el-descriptions-item>
          <el-descriptions-item class="p8" label="密码:" width="33%">
            <el-skeleton-item class="inline" variant="text"  style="width: calc(100% - 80px);"/>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #default>
        <el-descriptions :column="3" title="管理员信息">
          <el-descriptions-item class="p8" label="用户名:" width="33%">
            {{ form.nickname}}
          </el-descriptions-item>
          <el-descriptions-item class="p8" label="头像:" width="33%">
            <el-image :src="form.photo" class="preview-image" :preview-src-list="[toOriginal(form.photo)]" preview-teleported/>
          </el-descriptions-item>
          <el-descriptions-item class="p8" label="密码:" width="33%">
            ********
            <IconButton :icon="RefreshRight" tooltip="重置密码" @click="resetPass"/>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-skeleton>
    <el-table ref="tableEl" :data="permissions" @click="superAdmin"
              @selectionChange="selectionChange">
      <el-table-column v-if="!isSuperAdmin" type="selection" width="55"/>
      <el-table-column label="权限" prop="description"></el-table-column>
      <el-table-column prop="permissionId">
        <template v-slot:header>
          <div class="cell">
            符号
            <div class="right">
              <IconButton :disabled="!permissionChcked" :icon="Upload" tooltip="上传" type="primary"
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

.inline {
  display: inline-flex;
}
</style>
<script lang="ts">
export default { name: 'edit' }
</script>
