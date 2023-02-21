<template>
  <el-header v-show="!isTagsViewCurrenFull" class="layout-header">
    <NavBarsIndex/>
  </el-header>
</template>

<script lang="ts" name="layoutHeader" setup>
// 引入组件
import NavBarsIndex from '/@/layout/navBars/index.vue'
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes'
import { storeToRefs } from 'pinia'

// 定义变量内容
const storesTagsViewRoutes = useTagsViewRoutes()
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes)
</script>
