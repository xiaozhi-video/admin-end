<script lang="ts" setup>

defineProps<{
  src?: string
  poster?: string
}>()
import { refEl } from '/@/utils'

const videoEl = refEl(HTMLVideoElement)

</script>

<template>
  <div class="video-paly">
    <video class="video" ref="videoEl" :src="src" :poster="poster" controls></video>
  </div>
</template>

<style lang="scss" scoped>
.video-paly,.video {
  width: 100%;
  height: 100%;
}
</style>
<script lang="ts">
export default { name: 'VideoPaly' }
</script>
