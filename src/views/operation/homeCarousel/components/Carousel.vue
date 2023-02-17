<script lang="ts" setup>
import { CarouselInfo } from '/@/api/carousel'
import { refEls } from '/@/utils'
import CarouselItem from '/@/views/operation/homeCarousel/components/CarouselItem.vue'
import NewComponent from '/@/views/operation/homeCarousel/components/NewComponent.vue'

const props = defineProps<{
  modelValue: CarouselInfo[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: CarouselInfo[]): void
  (e: 'toView', v: number): void
}>()

function update(item: CarouselInfo, update: Partial<CarouselInfo>) {
  const list = props.modelValue.map(e => {
    return e === item ? Object.assign({}, e, update) : e
  })
  emit('update:modelValue', list)
}

const items = refEls()

defineExpose({
  async validate() {
    const ts = items.value!
    for(let i = 0; i < ts.length; i++) {
      const e = ts[i]
      try {
        await e.validate()
      } catch(e) {
        emit('toView', i)
        return
      }
    }
  },
})

function up(index: number) {
  const nr = Array.from(props.modelValue)
  const t = nr[index]
  nr[index] = nr[index - 1]
  nr[index - 1] = t
  emit('update:modelValue', nr)
}

function down(index: number) {
  const nr = Array.from(props.modelValue)
  const t = nr[index]
  nr[index] = nr[index + 1]
  nr[index + 1] = t
  emit('update:modelValue', nr)
}

function del(item: CarouselInfo) {
  emit('update:modelValue', props.modelValue.filter(e => e !== item))
}

</script>

<template>
  <el-button @click="del(modelValue[0])">删除</el-button>
  <transition-group class="box" name="fade" tag="div">
        <CarouselItem v-for="item in modelValue" :key="item.id" :model-value="item"/>
<!--    <CarouselItem v-for="(item, index) in modelValue" :key="item.id"-->
<!--                  ref="items"-->
<!--                  :index="index"-->
<!--                  :length="modelValue.length"-->
<!--                  :modelValue="item"-->
<!--                  @del="del(item)"-->
<!--                  @down="down"-->
<!--                  @up="up"-->
<!--                  @update:modelValue="update(item, $event)"-->
<!--    />-->

  </transition-group>
</template>
<script lang="ts">
export default { name: 'Carousel' }
</script>
<style lang="scss" scoped>
/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s ease;
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.fade-leave-active {
  position: absolute;
}

.box {
  min-height: 260px;
  position: relative;
}

:deep(.el-descriptions__cell) {
  padding-bottom: 6px !important;
}
</style>
