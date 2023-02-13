<script lang="ts" setup>
import { addClassifyApi, ClassifyInfo, delClassifyApi, getClassifyListApi } from '/@/api/classify'
import { Delete, Plus, Upload } from '@element-plus/icons-vue'
import { ElMessage, UploadProps } from 'element-plus'
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
  if(status !== 200) {
    ElMessage.error({
      message: '发生意外错误',
    })
    return
  }
  getList()
}

const previewImage = ref('')

const add = () => {
  list.value.unshift({ ADD: true, name: '', icon: '' })
}

const uploadLoading = ref(false)

const bindUpload = {
  action: "http://47.100.96.69:7001/upload/image",
  name: 'file',
  accept: 'image/*',
  showFileList: false,
  beforeUpload: ((file) => {
    console.log(file)
    if(!/image\/(x-icon|jpeg|png|svg|tiff)/.test(file.type)) {
      ElMessage.error('文件类型不受支持')
      return
    }
    uploadLoading.value = true
  }) as UploadProps['beforeUpload'],
  onSuccess: ((res) => {
    uploadLoading.value = false
    previewImage.value = res.url
    const from = list.value[0]!
    from.icon = res.path
  }) as UploadProps['onSuccess'],
  onError: ((res) => {
    ElMessage.error(res.message)
    uploadLoading.value = false
    console.log(res)
  }) as UploadProps['onError']
}

const submit = async () => {
  const { name, icon } = list.value[0] as ClassifyInfo
  if(name.length < 2 || name.length > 8) return ElMessage.error('分类名长度必须在2-8之间')
  if(!icon) return ElMessage.error('未上传图标')
  const { data, status } = await addClassifyApi({ name, icon })
  if(status === 200) {
    ElMessage.success('上传成功')
    previewImage.value = ''
    await getList()
  }
}

const shutDownAdd = () => {
  list.value.shift()
  previewImage.value = ''
}

onMounted(() => {
  getList()
})

</script>

<template>
  <div>
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
            <el-upload v-loading="uploadLoading" class="avatar-uploader preview-image" v-bind="bindUpload">
              <img v-if="previewImage" :src="previewImage" class="avatar"/>
              <el-icon v-else class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </div>
          <div v-else class="cell">
            <el-image class="preview-image" :src="row.icon"></el-image>
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
            <el-button :disabled="!!(list.length && 'ADD' in list[0])" :icon="Plus" circle class="add"
                       size="default"
                       type="primary" @click="add">
            </el-button>
          </div>
        </template>
        <template v-slot="{row}">
          <div v-if="row.ADD" class="cell">
            <el-button :icon="Upload" circle size="default" type="primary"
                       @click="submit"></el-button>
            <el-button :icon="Delete" circle size="default" type="danger"
                       @click="shutDownAdd"></el-button>
          </div>
          <div v-else class="cell">
            <el-popconfirm title="确定删除该分类？" @confirm="delClassify(row.name)">
              <template v-slot:reference>
                <el-button :icon="Delete" circle size="default" type="danger"></el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.add {
  float: right
}

:deep(.el-upload-list) {
  margin: 0;
}

.preview-image {
  width: 64px;
  height: 64px;
}

.avatar {
  height: 100%;
  width: 100%;
}
</style>
<script lang="ts">
export default { name: 'classify' }
</script>
