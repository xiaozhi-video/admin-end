<script lang="ts" setup>
import { CarouselInfo } from '/@/api/carousel'
import { Plus } from '@element-plus/icons-vue'

defineProps<{
  list: CarouselInfo[]
}>()
defineEmits<{
  (e: 'add', v: void): void
  (e: 'toView', v: number): void
}>()
</script>

<template>
  <el-scrollbar class="p8">
    <div class="b16-9 mb6">
      <div class="add-item" @click="$emit('add')">
        <el-icon>
          <Plus/>
        </el-icon>
      </div>
    </div>
    <div v-for="(item, index) in list" :key="index" class="thumbnail b16-9"
         @click="$emit('toView', index)">
      <div class="wr">
        <img :src="item.imagePreview" class="tile"/>
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

.add-item {
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--next-bg-topBar);
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }
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
