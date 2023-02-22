<script lang="ts" setup>
import { ImageInfo } from '/@/api/upload'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, UploadProps } from 'element-plus'
import { ref } from 'vue'

const uploadLoading = ref(false)

withDefaults(
	defineProps<{
		action?: string
		accept?: string
		url?: string
		path?: string
	}>(),
	{
		action: 'http://47.100.96.69:7001/upload/image',
		accept: 'image/jpeg,png,svg,ico,tiff',
	}
)

const emit = defineEmits<{
	(e: 'before', v: void): void
	(e: 'success', v: ImageInfo): void
	(e: 'fail', v: any): void
}>()

const bindUpload = {
	showFileList: false,
	beforeUpload: (() => {
		uploadLoading.value = true
		emit('before')
	}) as UploadProps['beforeUpload'],
	onSuccess: ((res) => {
		uploadLoading.value = false
		emit('success', res)
	}) as UploadProps['onSuccess'],
	onError: ((res) => {
		uploadLoading.value = false
		emit('fail', res)
		ElMessage.error(res.message)
		uploadLoading.value = false
	}) as UploadProps['onError'],
}
</script>

<template>
	<el-upload v-loading="uploadLoading" :accept="action" :action="action" class="avatar-uploader" v-bind="bindUpload">
		<img v-if="url" :src="url" class="tile" />
		<el-icon v-else class="avatar-uploader-icon">
			<Plus />
		</el-icon>
	</el-upload>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
export default { name: 'UploadOne' }
</script>
