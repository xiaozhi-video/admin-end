<template>
  <div class="table-container">
    <el-table
        v-loading="config.loading"
        :border="setBorder"
        :data="data"
        row-key="id"
        stripe
        style="width: 100%"
        v-bind="$attrs"
        @selection-change="onSelectionChange"
    >
      <el-table-column v-if="config.isSelection" :reserve-selection="true" type="selection"
                       width="30"/>
      <el-table-column v-if="config.isSerialNo" label="序号" type="index" width="60"/>
      <el-table-column
          v-for="(item, index) in setHeader"
          :key="index"
          :label="item.title"
          :prop="item.key"
          :width="item.colWidth"
          show-overflow-tooltip
      >
        <template v-slot="scope">
          <template v-if="item.type === 'image'">
            <img :height="item.height" :src="scope.row[item.key]" :width="item.width"/>
          </template>
          <template v-else>
            {{ scope.row[item.key] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="config.isOperate" label="操作" width="100">
        <template v-slot="scope">
          <el-popconfirm title="确定删除吗？" @confirm="onDelRow(scope.row)">
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据"/>
      </template>
    </el-table>
    <div class="table-footer mt15">
      <el-pagination
          v-model:current-page="state.page.pageNum"
          v-model:page-size="state.page.pageSize"
          :page-sizes="[10, 20, 30]"
          :pager-count="5"
          :total="config.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
      >
      </el-pagination>
      <div class="table-footer-tool">
        <SvgIcon :size="22" name="iconfont icon-yunxiazai_o" title="导出" @click="onImportTable"/>
        <SvgIcon :size="22" name="iconfont icon-shuaxin" title="刷新" @click="onRefreshTable"/>
        <el-popover
            :persistent="false"
            :width="300"
            placement="top-end"
            popper-class="table-tool-popper"
            transition="el-zoom-in-top"
            trigger="click"
            @show="onSetTable"
        >
          <template #reference>
            <SvgIcon :size="22" name="iconfont icon-quanjushezhi_o" title="设置"/>
          </template>
          <template #default>
            <div class="tool-box">
              <el-tooltip content="拖动进行排序" placement="top-start">
                <SvgIcon :size="17" class="ml11" color="#909399" name="fa fa-question-circle-o"/>
              </el-tooltip>
              <el-checkbox
                  v-model="state.checkListAll"
                  :indeterminate="state.checkListIndeterminate"
                  class="ml10 mr1"
                  label="列显示"
                  @change="onCheckAllChange"
              />
              <el-checkbox v-model="getConfig.isSerialNo" class="ml12 mr1" label="序号"/>
              <el-checkbox v-model="getConfig.isSelection" class="ml12 mr1" label="多选"/>
            </div>
            <el-scrollbar>
              <div ref="toolSetRef" class="tool-sortable">
                <div v-for="v in header" :key="v.key" :data-key="v.key" class="tool-sortable-item">
                  <i class="fa fa-arrows-alt handle cursor-pointer"></i>
                  <el-checkbox v-model="v.isCheck" :label="v.title" class="ml12 mr8" size="default"
                               @change="onCheckChange"/>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="netxTable" setup>
import { useThemeConfig } from '/@/stores/themeConfig'
import '/@/theme/tableTool.scss'
import { ElMessage } from 'element-plus'
import table2excel from 'js-table2excel'
import { storeToRefs } from 'pinia'
import Sortable from 'sortablejs'
import { computed, nextTick, reactive, ref } from 'vue'

// 定义父组件传过来的值

const props = withDefaults(defineProps<{
  data: Array<EmptyObjectType>
  header: Array<EmptyObjectType>
  config: {[x: string]: any}
}>(), {
  data: () => [],
  header: () => [],
  default: () => ({})
})

// 定义子组件向父组件传值/事件
const emit = defineEmits([ 'delRow', 'pageChange', 'sortHeader' ])

// 定义变量内容
const toolSetRef = ref()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const state = reactive({
  page: {
    pageNum: 1,
    pageSize: 10,
  },
  selectlist: [] as EmptyObjectType[],
  checkListAll: true,
  checkListIndeterminate: false,
})

// 设置边框显示/隐藏
const setBorder = computed(() => {
  return props.config.isBorder ? true : false
})
// 获取父组件 配置项（必传）
const getConfig = computed(() => {
  return props.config
})
// 设置 tool header 数据
const setHeader = computed(() => {
  return props.header.filter((v) => v.isCheck)
})
// tool 列显示全选改变时
const onCheckAllChange = <T>(val: T) => {
  if(val) props.header.forEach((v) => (v.isCheck = true))
  else props.header.forEach((v) => (v.isCheck = false))
  state.checkListIndeterminate = false
}
// tool 列显示当前项改变时
const onCheckChange = () => {
  const headers = props.header.filter((v) => v.isCheck).length
  state.checkListAll = headers === props.header.length
  state.checkListIndeterminate = headers > 0 && headers < props.header.length
}
// 表格多选改变时，用于导出
const onSelectionChange = (val: EmptyObjectType[]) => {
  state.selectlist = val
}
// 删除当前项
const onDelRow = (row: EmptyObjectType) => {
  emit('delRow', row)
}
// 分页改变
const onHandleSizeChange = (val: number) => {
  state.page.pageSize = val
  emit('pageChange', state.page)
}
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.page.pageNum = val
  emit('pageChange', state.page)
}
// 搜索时，分页还原成默认
const pageReset = () => {
  state.page.pageNum = 1
  state.page.pageSize = 10
  emit('pageChange', state.page)
}
// 导出
const onImportTable = () => {
  if(state.selectlist.length <= 0) return ElMessage.warning('请先选择要导出的数据')
  table2excel(props.header, state.selectlist, `${ themeConfig.value.globalTitle } ${ new Date().toLocaleString() }`)
}
// 刷新
const onRefreshTable = () => {
  emit('pageChange', state.page)
}
// 设置
const onSetTable = () => {
  nextTick(() => {
    const sortable = Sortable.create(toolSetRef.value, {
      handle: '.handle',
      dataIdAttr: 'data-key',
      animation: 150,
      onEnd: () => {
        const headerList: EmptyObjectType[] = []
        sortable.toArray().forEach((val) => {
          props.header.forEach((v) => {
            if(v.key === val) headerList.push({ ...v })
          })
        })
        emit('sortHeader', headerList)
      },
    })
  })
}

// 暴露变量
defineExpose({
  pageReset,
})
</script>

<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
  }

  .table-footer {
    display: flex;

    .table-footer-tool {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      i {
        margin-right: 10px;
        cursor: pointer;
        color: var(--el-text-color-regular);

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
