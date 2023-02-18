<script lang="ts" setup>
import { CarouselInfo } from '/@/api/carousel'
import { ImageInfo } from '/@/api/upload'
import IconButton from '/@/components/iconButton/index.vue'
import UploadOne from '/@/components/uploadOne/index.vue'
import { refEl } from '/@/utils'
import { ArrowDown, ArrowUp, Delete } from '@element-plus/icons-vue'
import { ElForm, FormRules } from 'element-plus'
import { onMounted } from 'vue'

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
  (e: 'update:validate', v: Function): void
}>()

const rules: FormRules = {
  url: [
    {
      required: true, message: 'url为必填选项',
    },
  ],
  image: [
    {
      required: true, message: '请上传图片',
    },
  ],
}

function update(update: Partial<CarouselInfo>) {
  emit('update:modelValue', { ...props.modelValue, ...update })
}

function success({ url, path }: ImageInfo) {
  console.log({ image: path, imagePreview: url })
  update({ image: path, imagePreview: url })
}

const formEl = refEl(ElForm)
// !!
onMounted(() => {
  emit('update:validate', () => formEl.value!.validate())
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
        <el-form-item label="URL" prop="url">
          <el-input :model-value="modelValue.url" @input="update({url: $event})"/>
        </el-form-item>
        <el-form-item label="操作">
          <IconButton :disabled="index === 0" :icon="ArrowUp" tooltip="向前移动"
                      @click="$emit('up', index)"/>
          <IconButton :disabled="index === length - 1" :icon="ArrowDown"
                      tooltip="向后移动" @click="$emit('down', index)"/>
          <el-popconfirm title="确定删除？" @confirm="$emit('del')">
            <template v-slot:reference>
              <span class="ml12">
                <IconButton :icon="Delete" tooltip="删除" type="danger"></IconButton>
              </span>
            </template>
          </el-popconfirm>
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
