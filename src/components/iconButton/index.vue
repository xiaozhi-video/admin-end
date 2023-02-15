<script lang="ts" setup>

import { ButtonProps } from 'element-plus'

defineProps<{
  icon: ButtonProps['icon']
  type?: ButtonProps['type']
  tooltip?: string
  disabled?: boolean
  text?: boolean
}>()

defineEmits<{
  (e: 'click', v: MouseEvent): void
}>()

</script>

<template>
  <el-tooltip
      :content="tooltip"
      effect="dark"
      placement="top-start"
  >
    <el-button :disabled="disabled" :icon="icon" :text="text" :type="type" circle
               class="icon-button" size="default" @click="$emit('click', $event)"></el-button>
  </el-tooltip>
</template>

<style lang="scss" scoped>
</style>
<script lang="ts">
export default { name: 'IconButton' }
</script>
