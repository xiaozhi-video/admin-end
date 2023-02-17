<script lang="ts" setup>
defineProps<{
  modelValue: any
}>()
</script>
<template>
  <div>
    {{ modelValue.id }}
  </div>
</template>
<script lang="ts">
export default {
  name: 'NewComponent',
}
</script>
