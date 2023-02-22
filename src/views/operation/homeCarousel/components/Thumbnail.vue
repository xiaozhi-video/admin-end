<script lang="ts" setup>
import { CarouselInfo } from '/@/api/carousel'
import { refEl } from '/@/utils'
import Sortable from 'sortablejs'
import { onMounted } from 'vue'

const props = defineProps<{
	modelValue: CarouselInfo[]
}>()
const emit = defineEmits<{
	(e: 'toView', v: number): void
	(e: 'update:modelValue', v: CarouselInfo[]): void
}>()

const box = refEl(HTMLDivElement)

onMounted(() => {
	const sortable = Sortable.create(box.value!, {
		handle: '.handle',
		dataIdAttr: 'data-key',
		animation: 150,
		onEnd: () => {
			const list: any[] = []
			sortable.toArray().forEach((val) => {
				props.modelValue.forEach((v) => {
					if (v.id === val) list.push({ ...v })
				})
			})
			emit('update:modelValue', list)
		},
	})
})
</script>

<template>
	<el-scrollbar class="p8">
		<div ref="box" class="box">
			<div v-for="(item, index) in modelValue" :key="item.id" :data-key="item.id" class="thumbnail b16-9 handle" @click="$emit('toView', index)">
				<div class="wr">
					<img :src="item.imagePreview" class="tile" />
				</div>
			</div>
		</div>
	</el-scrollbar>
</template>
<script lang="ts">
export default {
	name: 'Thumbnail',
}
</script>
<style lang="scss" scoped>
.thumbnail {
	cursor: pointer;
	background-color: var(--next-bg-topBar);
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	margin-bottom: 6px;
}

.wr {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

:deep(.el-descriptions__cell) {
	padding-bottom: 6px !important;
}
</style>
