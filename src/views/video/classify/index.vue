<script lang="ts" setup>
import { addClassifyApi, ClassifyInfo, delClassifyApi, getClassifyListApi } from '/@/api/classify'
import IconButton from '/@/components/iconButton/index.vue'
import UploadOne from '/@/components/uploadOne/index.vue'
import { refEl } from '/@/utils'
import { toOriginal } from '/@/utils/image'
import { Close, Delete, Plus, Refresh, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const list = ref<(ClassifyInfo & { ADD?: true })[]>([])
const loading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const { data } = await getClassifyListApi()
    list.value = data.data
  } catch(err) { /* empty */
  }
  loading.value = false
}

const delClassify = async (name: string) => {
  const { data, status } = await delClassifyApi({ name })
  if(status === 200) {
    ElMessage.success('删除成功')
    getList()
  }
}

const add = () => {
  list.value.unshift({ ADD: true, name: '', icon: '' })
}

function uploaded(res: any) {
  const from = list.value[0]!
  from.icon = res.path
}

const uploadEl = refEl()

const submit = async () => {
  const { name, icon } = list.value[0] as ClassifyInfo
  if(name.length < 2 || name.length > 8) return ElMessage.error('分类名长度必须在2-8之间')
  if(!icon) return ElMessage.error('未上传图标')
  const { data, status } = await addClassifyApi({ name, icon })
  if(status === 200) {
    ElMessage.success('上传成功')
    uploadEl.value.reset()
    await getList()
  }
}

const shutDownAdd = () => {
  list.value.shift()
  uploadEl.value.reset()
}

onMounted(() => {
  getList()
})

</script>

<template>
  <div class="p8">
    <el-table v-loading="loading" :data="list">
      <el-table-column label="名字">
        <template v-slot="{row}">
          <div v-if="row.ADD" class="cell">
            <el-input v-model="row.name" maxlength="8" size="default"></el-input>
          </div>
          <div v-else class="cell">
            {{ row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图标" prop="icon">
        <template v-slot="{row}">
          <div v-if="row.ADD" class="cell">
            <UploadOne ref="uploadEl" class="preview-image" @success="uploaded"/>
          </div>
          <div v-else class="cell">
            <el-image :preview-src-list="[toOriginal(row.icon)]" :src="row.icon" class="preview-image"
                      preview-teleported></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作品数量">
        <template v-slot="{row}">
          <div v-if="row.ADD" class="cell">
            不可用
          </div>
          <div v-else class="cell">
            {{ row.count }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:header>
          <div class="cell">
            操作
            <div class="right">
              <IconButton :disabled="!!(list.length && 'ADD' in list[0])" :icon="Plus" tooltip="添加"
                          type="primary" @click="add"/>
              <IconButton :icon="Refresh" tooltip="刷新" @click="getList"/>
            </div>
          </div>
        </template>
        <template v-slot="{row}">
          <div v-if="row.ADD" class="cell">
            <IconButton :icon="Upload" tooltip="提交" type="primary" @click="submit"></IconButton>
            <IconButton :icon="Close" tooltip="取消" type="danger"
                        @click="shutDownAdd"></IconButton>
          </div>
          <div v-else class="cell">
            <el-popconfirm title="确定删除该分类？" @confirm="delClassify(row.name)">
              <template v-slot:reference>
                <div>
                  <IconButton :icon="Delete" tooltip="删除" type="danger"></IconButton>
                </div>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.right {
  float: right;
  margin-left: 6px;
}

:deep(.el-upload-list) {
  margin: 0;
}

.avatar {
  height: 100%;
  width: 100%;
}
</style>
<script lang="ts">
export default { name: 'classify' }
</script>
