<script lang="ts" setup>
import { bulletInfo, delBulletApi, getBulletApi } from '/@/api/bullet'
import { getFromId, VideoInfo } from '/@/api/video'
import { refEl } from '/@/utils'
import { CircleClose, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const videoEl = refEl(HTMLVideoElement)

const loading = ref(false)

const height = ref('200px')

const obr = new ResizeObserver((e) => {
	height.value = videoEl.value!.offsetHeight + 'px'
})

function toTime(time: number) {
	const m = Math.floor(time / 60)
	const s = time % 60
	return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0')
}

function navigateTime(time: number) {
	videoEl.value!.currentTime = time
}

const getBullet = async () => {
	loading.value = true
	const { data, status } = await getBulletApi({ videoId: form.videoId! })
	loading.value = false
	if (status === 200) {
		form.bulletList = data.data
		form.bulletCount = data.data.length
	}
}

const del = async (row: bulletInfo) => {
	const { status } = await delBulletApi({ id: row.id })
	if (status === 200) {
		ElMessage.success('已删除')
		getBullet()
	}
}

const items = ref<InstanceType<typeof HTMLDivElement>[]>()

function timeupdate(e: Event) {
	const t = videoEl.value!.currentTime
	const ls = form.bulletList
	if (!ls) return
	for (let i = ls.length - 1; i > -1; i--) {
		const e = ls[i]
		if (e.time < t) {
			const a = items.value![i]
			if (a) {
				a.scrollIntoView({
					block: 'nearest',
					behavior: 'smooth',
				})
			}
			return
		}
	}
}

onMounted(() => {
	obr.observe(videoEl.value!)
})

const route = useRoute()

const form: Partial<VideoInfo> = reactive({})

const getForm = async () => {
	const videoId = route.query.videoId as string
	if (!videoId) return
	const { data } = await getFromId({ videoId })
	Object.assign(form, data.data)
}

onMounted(() => {
	getForm()
})
</script>

<template>
	<div class="p8">
		<div class="video-paly">
			<div class="b16-9">
				<div class="video-box">
					<video ref="videoEl" :poster="form.cover" :src="form.videoUrl" class="video" controls @timeupdate="timeupdate"></video>
				</div>
			</div>
			<el-card :style="{ height }" class="bullet-box">
				<template #header>
					<div class="bullet-header">
						<h3>弹幕列表</h3>
						<span
							>共{{ form.bulletCount }}条弹幕
							<el-button :icon="Refresh" circle text @click="getBullet" />
						</span>
					</div>
				</template>
				<el-scrollbar v-loading="loading">
					<div v-for="(item, index) in form.bulletList" :key="index" ref="items" class="bullet-item">
						<div class="text">
							{{ item.text }}
						</div>
						<div class="time info">
							<div @click="navigateTime(item.time)">
								{{ toTime(item.time) }}
							</div>
							<el-button :icon="CircleClose" circle text @click="del(item)" />
						</div>
					</div>
				</el-scrollbar>
			</el-card>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.video {
	width: 100%;
	height: 100%;
}

.video-box {
	background-color: #000;
}

.video-paly {
	display: flex;

	.b16-9 {
		flex: 1;
		width: 0;
		flex-shrink: 0;
	}

	.bullet-box {
		margin-left: 8px;
		flex: 0.32;
		height: 100%;
		display: flex;
		flex-direction: column;

		:deep(.el-card__body) {
			flex: 1;
			height: 0;
			padding: 0;
		}

		.bullet-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.info {
			color: #444;
		}

		.bullet-item {
			display: flex;
			margin: 16px;
			//& + .bullet-item {
			//  margin-top: 12px;
			//}

			.text {
				flex: 1;
			}

			.time {
				text-align: right;
				font-size: 14px;
				cursor: pointer;
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>

<script lang="ts">
export default { name: 'play' }
</script>
