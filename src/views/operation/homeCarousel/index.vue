<script lang="ts" setup>
import { CarouselInfo, getCarouselApi, putCarouselApi } from '/@/api/carousel'
import { randomString, refEl } from '/@/utils'
import Carousel from '/@/views/operation/homeCarousel/components/Carousel.vue'
import Thumbnail from '/@/views/operation/homeCarousel/components/Thumbnail.vue'
import { Menu, Plus, Refresh, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const maxNumber = ref(9)

const getList = async () => {
	loading.value = true
	const { data } = await getCarouselApi()
	list.value = data.data
	loading.value = false
}

onMounted(() => {
	getList()
})

const list = ref<CarouselInfo[]>([])
const showSlider = ref(false)
const loading = ref(false)

function toView(index: number) {
	const ele = document.querySelectorAll('#selector .carousel-item')
	if (ele.length)
		ele[index].scrollIntoView({
			block: 'nearest',
			behavior: 'smooth',
		})
	showSlider.value = false
}

const submitMap = ({ image, url, id, videoId }: CarouselInfo) => {
	const p = { image, url, id, videoId }
	if (videoId) {
		delete p.url
	}
	return p
}

const submit = async () => {
	if (!(await formEl.value!.validate())) return
	loading.value = true
	const carousel = list.value.map(submitMap)
	const { status } = await putCarouselApi({
		carousel,
	})
	loading.value = false
	if (status == 200) {
		ElMessage.success('已提交')
		await getList()
	}
}

const formEl = refEl()

function add() {
	if (list.value.length >= maxNumber.value) {
		ElMessage.warning('达到最大数量')
		return
	}
	list.value.unshift({ url: '', image: '', imagePreview: '', id: randomString() })
	toView(0)
}
</script>

<template>
	<div ref="" class="p8">
		<el-affix>
			<el-descriptions :column="3" class="mb6">
				<el-descriptions-item label="当前数量">{{ list.length }}</el-descriptions-item>
				<el-descriptions-item label="最大数量">{{ maxNumber }}</el-descriptions-item>
				<el-descriptions-item>
					<el-button :icon="Menu" type="primary" @click="showSlider = true"> 打开缩略图 </el-button>
					<el-button :icon="UploadFilled" type="primary" @click="submit"> 提交 </el-button>
					<el-button :icon="Plus" type="primary" @click="add"> 添加 </el-button>
					<el-button :icon="Refresh" type="primary" @click="getList"> 刷新 </el-button>
				</el-descriptions-item>
			</el-descriptions>
		</el-affix>
		<Carousel id="selector" ref="formEl" v-model="list" v-loading="loading" @to-view="toView" />
		<el-drawer v-model="showSlider" :lock-scroll="false" :modal="true" class="slider" size="160px">
			<Thumbnail v-model="list" @to-view="toView" />
		</el-drawer>
	</div>
</template>

<style lang="scss" scoped>
:deep(.el-descriptions__cell) {
	padding-bottom: 6px !important;
}
</style>
<script lang="ts">
export default { name: 'homeCarousel' }
</script>
