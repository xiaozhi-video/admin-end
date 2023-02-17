<script lang="ts" setup>
// import { CarouselInfo } from '/@/api/carousel'
// import { ImageInfo } from '/@/api/upload'
// import IconButton from '/@/components/iconButton/index.vue'
// import UploadOne from '/@/components/uploadOne/index.vue'
// import { refEl } from '/@/utils'
// import { ArrowDown, ArrowUp, Delete } from '@element-plus/icons-vue'
// import { ElForm, FormRules } from 'element-plus'

// const props = defineProps<{
//   modelValue: CarouselInfo
//   // index: number
//   // length: number
// }>()
defineProps<{
  modelValue: any
}>()
// const emit = defineEmits<{
//   (e: 'update:modelValue', v: CarouselInfo): void
//   (e: 'up', v: void): void
//   (e: 'down', v: void): void
//   (e: 'del', v: void): void
// }>()

// const rules: FormRules = {
//   url: [
//     {
//       required: true, message: 'url为必填选项',
//     },
//   ],
//   image: [
//     {
//       required: true, message: '请上传图片',
//     },
//   ],
// }
//
// function update(update: Partial<CarouselInfo>) {
//   emit('update:modelValue', { ...props.modelValue, ...update })
// }
//
// function success(item: CarouselInfo, { url, path }: ImageInfo) {
//   update({ image: path, imagePreview: url })
// }
//
// const formEl = refEl(ElForm)
//
// defineExpose({
//   async validate() {
//     await formEl.value!.validate()
//   },
// })
</script>

<template>
  <div>
    {{ modelValue.id }}
  </div>
<!--  <div class="carousel-item p8">-->
<!--    {{ modelValue.id }}-->
<!--    <el-form ref="formEl" :model="modelValue" :rules="rules" class="form" inline>-->
<!--      <el-form-item class="w360" prop="image">-->
<!--        <div class="b16-9 w100">-->
<!--          <UploadOne :path="modelValue.image"-->
<!--                     :url="modelValue.imagePreview"-->
<!--                     class="w100"-->
<!--                     @success="success(modelValue, $event)"></UploadOne>-->
<!--        </div>-->
<!--      </el-form-item>-->
<!--      <div class="right">-->
<!--        <el-form-item label="URL" prop="url">-->
<!--          <el-input :model-value="modelValue.url" @input="update({url: $event})"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <IconButton :disabled="index === 0" :icon="ArrowUp" tooltip="向前移动"-->
<!--                      @click="$emit('up', index)"/>-->
<!--          <IconButton :disabled="index === length - 1" :icon="ArrowDown"-->
<!--                      tooltip="向后移动" @click="$emit('down', index)"/>-->
<!--          <el-popconfirm title="确定删除？" @confirm="$emit('del')">-->
<!--            <template v-slot:reference>-->
<!--              <span class="ml12">-->
<!--                <IconButton :icon="Delete" tooltip="删除" type="danger"></IconButton>-->
<!--              </span>-->
<!--            </template>-->
<!--          </el-popconfirm>-->
<!--        </el-form-item>-->
<!--      </div>-->
<!--    </el-form>-->
<!--    <el-divider/>-->
<!--  </div>-->
</template>
<script lang="ts">
export default {
  name: 'CarouselItem',
}
</script>
<!--<style lang="scss" scoped>-->
<!--:deep(.el-descriptions__cell) {-->
<!--  padding-bottom: 6px !important;-->
<!--}-->

<!--.form {-->
<!--  display: flex;-->
<!--}-->

<!--.carousel-item {-->
<!--  width: 100%;-->
<!--  background-color: var(&#45;&#45;el-fill-color-blank);-->
<!--}-->

<!--.w100 {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->

<!--.w360 {-->
<!--  flex: 1;-->
<!--}-->

<!--.right {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  flex: 1;-->
<!--}-->
<!--</style>-->
