<script lang="ts" name="home" setup>
import { putNicknameApi, putPasswordApi, putPhotoApi } from '/@/api/admin'
import { hal7DataApi, HalInfo } from '/@/api/data'
import UploadOne from '/@/components/uploadOne/index.vue'
import { useThemeConfig } from '/@/stores/themeConfig'
import { useUserInfo } from '/@/stores/userInfo'
import { refEl } from '/@/utils'
import * as echarts from 'echarts'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { storeToRefs } from 'pinia'
import { markRaw, nextTick, onMounted, reactive, ref, watch } from 'vue'

// 定义变量内容
const homeLineRef = ref()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const storesUser = useUserInfo()
const state = reactive({
  global: {
    homeChartOne: null,
    homeChartTwo: null,
    homeCharThree: null,
    dispose: [ null, '', undefined ],
  } as any,
  homeOne: [
    {
      num1: '125,12',
      num2: '-12.32',
      num3: '订单统计信息',
      num4: 'fa fa-meetup',
      color1: '#FF6462',
      color2: '--next-color-primary-lighter',
      color3: '--el-color-primary',
    },
    {
      num1: '653,33',
      num2: '+42.32',
      num3: '月度计划信息',
      num4: 'iconfont icon-ditu',
      color1: '#6690F9',
      color2: '--next-color-success-lighter',
      color3: '--el-color-success',
    },
    {
      num1: '125,65',
      num2: '+17.32',
      num3: '年度计划信息',
      num4: 'iconfont icon-zaosheng',
      color1: '#6690F9',
      color2: '--next-color-warning-lighter',
      color3: '--el-color-warning',
    },
    {
      num1: '520,43',
      num2: '-10.01',
      num3: '访问统计信息',
      num4: 'fa fa-github-alt',
      color1: '#FF6462',
      color2: '--next-color-danger-lighter',
      color3: '--el-color-danger',
    },
  ],
  myCharts: [] as EmptyArrayType,
  charts: {
    theme: '',
    bgColor: '',
    color: '#303133',
  },
})

const hal7List = ref<HalInfo[]>([])

// 折线图
const initLineChart = () => {
  if(!state.global.dispose.some((b: any) => b === state.global.homeChartOne)) state.global.homeChartOne.dispose()
  state.global.homeChartOne = markRaw(echarts.init(homeLineRef.value, state.charts.theme))
  const option = {
    backgroundColor: state.charts.bgColor,
    title: {
      text: '近七天点赞和浏览量',
      x: 'left',
      textStyle: { fontSize: '15', color: state.charts.color },
    },
    // grid: { top: 70, right: 20, bottom: 30, left: 30 },
    tooltip: { trigger: 'axis' },
    legend: { data: [ '点赞', '浏览' ], right: 0 },
    xAxis: {
      data: hal7List.value.map(e => e.date),
    },
    yAxis: [
      {
        type: 'value',
        name: '价格',
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
      },
    ],
    series: [
      {
        name: '点赞',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: hal7List.value.map(e => e.like),
        lineStyle: { color: '#fe9a8b' },
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fe9a8bb3' },
            { offset: 1, color: '#fe9a8b03' },
          ]),
        },
      },
      {
        name: '浏览',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: hal7List.value.map(e => e.history),
        lineStyle: { color: '#9E87FF' },
        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#9E87FFb3' },
            { offset: 1, color: '#9E87FF03' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: '#9E87FF' },
                { offset: 0.4, color: '#9E87FF' },
                { offset: 0.5, color: '#fff' },
                { offset: 0.7, color: '#fff' },
                { offset: 0.8, color: '#fff' },
                { offset: 1, color: '#fff' },
              ],
            },
            borderColor: '#9E87FF',
            borderWidth: 2,
          },
        },
      },
    ],
  }
  state.global.homeChartOne.setOption(option)
  state.myCharts.push(state.global.homeChartOne)
}

onMounted(async () => {
  const { data, status } = await hal7DataApi()
  if(status === 200) {
    hal7List.value = data.data
    initLineChart()
  }
})

// 监听 pinia 中是否开启深色主题
watch(
    () => themeConfig.value.isIsDark,
    (isIsDark) => {
      nextTick(() => {
        state.charts.theme = isIsDark ? 'dark' : ''
        state.charts.bgColor = isIsDark ? 'transparent' : ''
        state.charts.color = isIsDark ? '#dadada' : '#303133'
        setTimeout(() => {
          initLineChart()
        }, 100)
      })
    },
    {
      deep: true,
    },
)

const rules: FormRules = {
  nickname: [
    { required: true, message: '昵称不能为空' },
    { min: 2, max: 16, message: '昵称长度限制2-16' },
  ],
}

const passRules = [
  { required: true, message: '密码不能为空' },
  { min: 8, max: 16, message: '密码长度限制8-32' },
]

const rules2: FormRules = {
  oldPassword: passRules,
  newPassword: passRules,
}

const form = reactive({
  photo: '',
  nickname: storesUser.userInfos.nickname,
})

const form2 = reactive({
  oldPassword: '',
  newPassword: '',
})

const uploadPhoto = async (res: any) => {
  form.photo = res.path
  storesUser.userInfos.photo = res.url
  const { status } = await putPhotoApi({ photo: res.path })
  if(status === 200) {
    ElMessage.success('修改成功')
  }
}

const formEl = refEl(ElForm)

const putName = async () => {
  if(form.nickname === storesUser.userInfos.nickname) return
  try {
    await formEl.value!.validate()
    const { status } = await putNicknameApi({ nickname: form.nickname })
    if(status) {
      storesUser.userInfos.nickname = form.nickname
      ElMessage.success('修改成功')
    }
  } catch(err) { /* empty */
  }
}

const formEl2 = refEl(ElForm)

const putPass = async () => {
  try {
    await formEl2.value!.validate()
    const { oldPassword, newPassword } = form2
    const { status } = await putPasswordApi({ oldPassword, newPassword })
    if(status) {
      ElMessage.success('修改成功')
      formEl2.value!.resetFields()
    }
  } catch(err) { /* empty */
  }
}

</script>

<template>
  <div class="home-container layout-pd">
    <el-row :gutter="15" class="home-card-one mb15">
      <el-col
          v-for="(v, k) in state.homeOne"
          :key="k"
          :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }"
          :lg="6"
          :md="12"
          :sm="12"
          :xl="6"
          :xs="24"
      >
        <div class="home-card-item h1 flex">
          <div :class="` home-one-animation${k}`" class="flex-margin flex w100">
            <div class="flex-auto">
              <span class="font30">{{ v.num1 }}</span>
              <span :style="{ color: v.color1 }" class="ml5 font16">{{ v.num2 }}%</span>
              <div class="mt10">{{ v.num3 }}</div>
            </div>
            <div :style="{ background: `var(${v.color2})` }" class="home-card-item-icon flex">
              <i :class="v.num4" :style="{ color: `var(${v.color3})` }"
                 class="flex-margin font32"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-two mb15">
      <el-col :lg="16" :md="14" :sm="14" :xl="16" :xs="24">
        <div class="home-card-item h2">
          <div ref="homeLineRef" style="height: 100%"></div>
        </div>
      </el-col>
      <el-col :lg="8" :md="10" :sm="10" :xl="8" :xs="24" class="home-media">
        <el-scrollbar class="home-card-item h2">
          <el-form ref="formEl" :model="form" :rules="rules" inline @submit.native.prevent>
            <el-form-item class="mb0" prop="photo">
              <UploadOne :path="form.photo" :url="storesUser.userInfos.photo"
                         style="width: 80px; height: 80px;" @success="uploadPhoto"/>
            </el-form-item>
            <el-form-item class="mb0" prop="nickname">
              <input v-model="form.nickname" class="inp" @change="putName"/>
            </el-form-item>
          </el-form>
          <div style="margin: 16px 0;">
            <h4 style="display: inline-block">
              我的权限:
            </h4>
            <el-tag v-for="item in storesUser.userInfos.permissionsDescription" :key="item"
                    class="permissions">
              {{ item }}
            </el-tag>
          </div>
          <h4 class="mb16">修改密码:</h4>
          <el-form ref="formEl2" :model="form2" :rules="rules2">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="form2.oldPassword" maxlength="32" show-password type="password"/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form2.newPassword" maxlength="32" show-password type="password"/>
            </el-form-item>
          </el-form>
          <div class="submit-box">
            <el-button type="primary" @click="putPass">提交</el-button>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
$homeNavLengh: 8;
.home-container {
  overflow: hidden;
}

:deep(.el-card__body) {
  height: 100%;
}

.inp {
  border: 0;
  outline: none;
  font-size: 20px;
  width: 160px;
}

.submit-box {
  margin: 16px 0;
  text-align: center;
}

.h1 {
  height: 130px;
}

.mb0 {
  margin-bottom: 0;
}

.h2 {
  height: 380px;
}

p {
  margin: 16px 0;
}

.permissions {
  margin: 2px;
}

.avatar-uploader :deep(.el-upload) {
  border-radius: 9999px;
}

.home-card-item {
  width: 100%;
  border-radius: 4px;
  transition: all ease 0.3s;
  overflow: hidden;
  background: var(--el-color-white);
  color: var(--el-text-color-primary);
  border: 1px solid var(--next-border-color-light);
  padding: 20px;

  &:hover {
    box-shadow: 0 2px 12px var(--next-color-dark-hover);
    transition: all ease 0.3s;
  }

  &-icon {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    flex-shrink: 1;

    i {
      color: var(--el-text-color-placeholder);
    }
  }

  &-title {
    font-size: 15px;
    font-weight: bold;
    height: 30px;
  }

  .home-card-item-icon {
    margin-left: 20px;
  }
}
</style>
