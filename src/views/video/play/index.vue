<script lang="ts" setup>

import { getFromId, VideoInfo } from '/@/api/video'
import VideoPaly from '/@/components/videoPlay/index.vue'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const form: Partial<VideoInfo> = reactive({
})

const getForm = async () => {
  const videoId = route.query.videoId as string
  if(!videoId) return
  const { data } = await getFromId({ videoId })
  Object.assign(form, data.data)
}

// watch(() => route.query.videoId, async () => {
//   getForm()
// })

onMounted(() => {
  getForm()
})

</script>

<template>
  <div class="p8">
    <VideoPaly :src="form.videoUrl" :poster="form.cover"/>
  </div>
</template>

<style lang="scss" scoped>
</style>
<script lang="ts">
export default { name: 'play' }
</script>
