<script lang="ts" setup>
import { CarouselInfo, getCarouselApi, putCarouselApi } from '/@/api/carousel'
import { refEl } from '/@/utils'
import Carousel from '/@/views/operation/homeCarousel/components/Carousel.vue'
import Thumbnail from '/@/views/operation/homeCarousel/components/Thumbnail.vue'
import { Menu, Plus, Refresh, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

function randomString(e = 32) {
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      l = t.length
  let n = ""
  for(let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * l))
  return n
}

const getList = async () => {
  loading.value = true
  const { data } = await getCarouselApi()
  list.value = data.data
  loading.value = false
}

onMounted(() => {
  getList()
})

const list = ref<CarouselInfo[]>([])
const showSlider = ref(false)
const loading = ref(false)

function toView(index: number) {
  const ele = document.querySelectorAll('#selector .carousel-item')
  if(ele.length) ele[index].scrollIntoView({
    block: 'nearest',
    behavior: 'smooth',
  })
  showSlider.value = false
}

const submit = async () => {
  await form.value!.validate()
  loading.value = true
  const carousel = list.value.map(
      ({
         image,
         url,
         id,
       }) => ({
        image,
        url,
        id,
      }))
  const { status } = await putCarouselApi({
    carousel,
  })
  loading.value = false
  if(status == 200) {
    ElMessage.success('已提交')
    await getList()
  }
}

const form = refEl()

function add() {
  list.value.unshift({ url: '', image: '', imagePreview: '', id: randomString() })
  toView(0)
}

</script>

<template>
  <div ref="" class="p8">
    <el-affix>
      <el-descriptions :column="3" class="mb6">
        <el-descriptions-item label="当前数量">{{ list.length }}</el-descriptions-item>
        <el-descriptions-item label="最大数量">{{ 9 }}</el-descriptions-item>
        <el-descriptions-item>
          <el-button :icon="Menu" size="default" type="primary" @click="showSlider = true">
            打开缩略图
          </el-button>
          <el-button :icon="UploadFilled" size="default" type="primary" @click="submit">
            提交
          </el-button>
          <el-button :icon="Plus" size="default" type="primary" @click="add">
            添加
          </el-button>
          <el-button :icon="Refresh" size="default" type="primary" @click="getList">
            刷新
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-affix>
    <Carousel id="selector" ref="form" v-model="list" v-loading="loading" @to-view="toView"/>
    <el-drawer v-model="showSlider" :lock-scroll="false" :modal="false" class="slider" size="160px">
      <Thumbnail :list="list" @add="add" @to-view="toView"/>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-descriptions__cell) {
  padding-bottom: 6px !important;
}
</style>
<script lang="ts">
export default { name: 'homeCarousel' }
</script>
