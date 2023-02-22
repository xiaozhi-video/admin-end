<template>
	<el-form class="login-content-form" size="large">
		<el-form-item class="login-animation1">
			<el-input v-model="state.ruleForm.nickname" :placeholder="$t('message.account.accountPlaceholder1')" autocomplete="off" clearable text>
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input
				v-model="state.ruleForm.password"
				:placeholder="$t('message.account.accountPlaceholder2')"
				:type="state.isShowPassword ? 'text' : 'password'"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-Unlock />
					</el-icon>
				</template>
				<template #suffix>
					<i
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						class="iconfont el-input__icon login-content-password"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-col :span="15">
				<el-input
					v-model="state.ruleForm.code"
					:placeholder="$t('message.account.accountPlaceholder3')"
					autocomplete="off"
					clearable
					maxlength="4"
					text
				>
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<Captcha v-waves :identifyCode="identifyCode" class="login-content-code" @click="generateVerificationCode"></Captcha>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button v-waves :loading="state.loading.signIn" class="login-content-submit" round type="primary" @click="onSignIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" name="loginAccount" setup>
import { loginApi } from '/@/api/admin'
import Captcha from '/@/components/captcha/index.vue'
// import { initBackEndControlRoutes } from '/@/router/backEnd'
import { initFrontEndControlRoutes } from '/@/router/frontEnd'
// import { useThemeConfig } from '/@/stores/themeConfig'
import { formatAxis } from '/@/utils/formatTime'
import { NextLoading } from '/@/utils/loading'
import { Session } from '/@/utils/storage'
import { ElMessage } from 'element-plus'
// import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

function randomNum(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min)
}

function makeCode(l: number = 4) {
	let s = ''
	for (let i = 0; i < l; i++) {
		s += randomNum(0, 9)
	}
	identifyCode.value = s
	return s
}

const identifyCode = ref('')

makeCode()

const generateVerificationCode = () => {
	makeCode()
}

onMounted(() => {
	generateVerificationCode()
})

// 定义变量内容
const { t } = useI18n()
// const storesThemeConfig = useThemeConfig()
// const { themeConfig } = storeToRefs(storesThemeConfig)
const route = useRoute()
const router = useRouter()
const state = reactive({
	isShowPassword: false,
	ruleForm: {
		nickname: '',
		password: '',
		code: '',
	},
	loading: {
		signIn: false,
	},
})

// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date())
})
// 登录
const onSignIn = async () => {
	if (identifyCode.value !== state.ruleForm.code) {
		ElMessage.error('验证码不正确')
		return
	}
	state.loading.signIn = true
	const { nickname, password } = state.ruleForm
	const { data, status } = await loginApi({ nickname, password })
	if (status !== 200) {
		if (status === 405) {
			ElMessage.error({
				message: '用户名或密码错误',
			})
		}
		state.loading.signIn = false
		return
	}
	// 存储 token 到浏览器缓存
	Session.set('token', data.authorization)
	// if(!themeConfig.value.isRequestRoutes) {
	// 前端控制路由，2、请注意执行顺序
	const isNoPower = await initFrontEndControlRoutes()
	signInSuccess(isNoPower)
	// } else {
	// // 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
	// // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
	// const isNoPower = await initBackEndControlRoutes()
	// // 执行完 initBackEndControlRoutes，再执行 signInSuccess
	// signInSuccess(isNoPower)
	// }
}
// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
	if (isNoPower) {
		ElMessage.warning('抱歉，您没有登录权限')
		Session.clear()
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = currentTime.value
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			})
		} else {
			router.push('/')
		}
		// 登录成功提示
		const signInText = t('message.signInText')
		ElMessage.success(`${currentTimeInfo}，${signInText}`)
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start()
	}
	state.loading.signIn = false
}
</script>

<style lang="scss" scoped>
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}

	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;

		&:hover {
			color: #909399;
		}
	}

	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
