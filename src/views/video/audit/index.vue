<script lang="ts" setup>
import { ClassifyInfo, getClassifyListApi } from '/@/api/classify'
import { PageParams } from '/@/api/user'
import { auditApi, getVideoApi, VideoInfo } from '/@/api/video'
import IconButton from '/@/components/iconButton/index.vue'
import Table from '/@/components/table/index.vue'
import { refEl, toPlay } from '/@/utils'
import { Upload, VideoCameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const tableEl = refEl(Table)

const tableOptions = reactive({
	data: [] as VideoInfo[],
	param: {
		pageNumber: 1,
		pageSize: 10,
	},
	header: [
		{
			key: 'title',
			title: '标题',
			type: 'text',
			isCheck: true,
			colWidth: '260px',
		},
		{
			key: 'describe',
			title: '描述',
			type: 'text',
			isCheck: true,
		},
		{
			key: 'cover',
			title: '封面',
			type: 'image',
			isCheck: true,
			colWidth: '150px',
			width: '112px',
			height: '63px',
		},
		{
			key: 'classify',
			title: '分类',
			isCheck: true,
			type: 'text',
			colWidth: '210px',
		},
		{
			key: 'createdAt',
			title: '提交时间',
			isCheck: true,
			type: 'date',
		},
		{
			key: 'author',
			title: '作者',
			isCheck: false,
			type: 'text',
			formatter(row: any) {
				return row.user.nickname
			},
		},
	],
	config: {
		total: 0, // 列表总数
		loading: false, // loading 加载
		isBorder: false, // 是否显示表格边框
		isSerialNo: false, // 是否显示表格序号
		isSelection: true, // 是否显示表格多选
		isOperate: true, // 是否显示表格操作栏
		operateWidth: '160px',
	},
})

const classifyList = ref<ClassifyInfo[]>([])

const query = reactive({
	keyWord: '',
	classify: '',
	state: 1,
})

const getList = async (page: PageParams) => {
	tableOptions.config.loading = true
	const { data } = await getVideoApi({ ...page, ...query })
	tableOptions.data = data.data
	tableOptions.config.total = data.total
	tableOptions.config.loading = false
}

const getClassify = async () => {
	const { data } = await getClassifyListApi()
	classifyList.value = data.data
}

const audit = async (row: VideoInfo) => {
	const { status } = await auditApi({ videoId: row.videoId })
	if (status === 200) {
		ElMessage.success('已通过审核')
		await tableEl.value!.flushed()
	}
}

onMounted(() => {
	getClassify()
})
</script>

<template>
	<div class="p8">
		<Table ref="tableEl" v-bind="tableOptions" @getDate="getList" @sortHeader="tableOptions.header = $event">
			<!--  操作    -->
			<template v-slot:operate="{ row }">
				<IconButton :icon="Upload" tooltip="通过审核" @click="audit(row)" type="success" />
				<IconButton :icon="VideoCameraFilled" tooltip="前往播放" @click="toPlay(row.videoId)" />
			</template>
			<!--   搜索   -->
			<template #titleHeader>
				<el-input v-model="query.keyWord" placeholder="搜索" @keyup.enter="tableEl.flushed()">
					<template #prepend>标题</template>
				</el-input>
			</template>
			<!--   分类过滤   -->
			<template #classifyHeader>
				<div class="filter-box">
					<el-select v-model="query.classify" class="filter-select" clearable filterable placeholder="选择分类" @change="tableEl.flushed()">
						<el-option v-for="item in classifyList" :key="item.name" :label="item.name" :value="item.name"> </el-option>
					</el-select>
				</div>
			</template>
		</Table>
	</div>
</template>

<style lang="scss" scoped>
:deep(.preview-image) {
	width: 112px;
	height: 63px;
}

.filter-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.filter-title {
	flex-shrink: 0;
}
</style>
<script lang="ts">
export default { name: 'audit' }
</script>
