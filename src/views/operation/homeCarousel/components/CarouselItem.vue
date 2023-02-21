<script lang="ts" setup>
import { CarouselInfo } from '/@/api/carousel'
import { ImageInfo } from '/@/api/upload'
import { getCover } from '/@/api/video'
import IconButton from '/@/components/iconButton/index.vue'
import UploadOne from '/@/components/uploadOne/index.vue'
import { refEl } from '/@/utils'
import { ArrowDown, ArrowUp, Delete, InfoFilled } from '@element-plus/icons-vue'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  modelValue: CarouselInfo
  index: number
  length: number
  validate?: Function
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: CarouselInfo): void
  (e: 'up', v: void): void
  (e: 'down', v: void): void
  (e: 'del', v: void): void
  // !!
  (e: 'mounted', v: any): void
}>()

const rules: FormRules = {
  url: [
    {
      required: true, message: 'url为必填选项',
    },
  ],
  videoId: [
    {
      required: true, message: '视频为必填选项',
    },
  ],
  image: [
    {
      required: true, message: '请上传图片',
    },
  ],
}

const handoff = ref(+!!props.modelValue.url)

function update(update: Partial<CarouselInfo>) {
  emit('update:modelValue', { ...props.modelValue, ...update })
}

function success({ url, path }: ImageInfo) {
  update({ image: path, imagePreview: url })
}

function changeHandoff() {
  if (handoff.value) {
    const url = props.modelValue.videoId
    update({ url, videoId: '' })
  } else {
    const videoId = props.modelValue.url
    update({ url: '', videoId })
  }
}

const appCoverloading = ref(false)

const getVideoInfo = async () => {
  try {
    await formEl.value!.validateField('videoId')
  } catch(err) {
    return
  }
  appCoverloading.value = true
  const { data, status } = await getCover({ videoId: props.modelValue.videoId! })
  appCoverloading.value = false
  if(status === 406) {
    ElMessage.error('找不到视频')
  } else if(status === 200) {
    update({
      imagePreview: data.coverPreview,
      image: data.cover,
    })
    ElMessage.success('应用成功')
  }
}

const formEl = refEl(ElForm)
// !!
onMounted(() => {
  const validate = async () => {
    await formEl.value!.validateField('image')
    if(handoff.value) {
      await formEl.value!.validateField('url')
    } else {
      await formEl.value!.validateField('videoId')
    }
  }
  emit('mounted', {id: props.modelValue.id, validate })
})
</script>
<template>
  <div class="carousel-item p8">
    <el-form ref="formEl" :model="modelValue" :rules="rules" class="form" inline>
      <el-form-item class="w360" prop="image">
        <div class="b16-9 w100">
          <UploadOne :path="modelValue.image"
                     :url="modelValue.imagePreview"
                     class="w100"
                     @success="success"></UploadOne>
        </div>
      </el-form-item>
      <div class="right">
        <el-form-item :prop="handoff ? 'url': 'videoId'" label="URL">
          <template #label>
            <el-radio-group v-model="handoff" @change="changeHandoff">
              <el-radio-button :label="0">视频</el-radio-button>
              <el-radio-button :label="1">外链</el-radio-button>
            </el-radio-group>
          </template>
          <el-input v-if="handoff" :model-value="modelValue.url" @input="update({url: $event})"/>
          <el-input v-else :model-value="modelValue.videoId" @input="update({videoId: $event})"/>
        </el-form-item>
        <el-form-item label="操作:">
          <el-popconfirm title="确定删除？" @confirm="$emit('del')">
            <template v-slot:reference>
              <span class="mr12">
                <IconButton :icon="Delete" tooltip="删除" type="danger"></IconButton>
              </span>
            </template>
          </el-popconfirm>
          <IconButton :disabled="index === 0" :icon="ArrowUp" tooltip="向前移动"
                      @click="$emit('up', index)"/>
          <IconButton :disabled="index === length - 1" :icon="ArrowDown"
                      tooltip="向后移动" @click="$emit('down', index)"/>
          <IconButton v-if="!handoff" :icon="InfoFilled" class="ml12" tooltip="应用视频封面"
                      @click="getVideoInfo"/>
        </el-form-item>
      </div>
    </el-form>
    <el-divider v-show="index < length - 1"/>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CarouselItem',
}
</script>
<style lang="scss" scoped>
:deep(.el-descriptions__cell) {
  padding-bottom: 6px !important;
}

.form {
  display: flex;
}

.carousel-item {
  width: 100%;
  background-color: var(--el-fill-color-blank);
}

.w100 {
  width: 100%;
  height: 100%;
}

.w360 {
  flex: 1;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}
</style>
