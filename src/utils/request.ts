import { Session } from '/@/utils/storage'
import axios, { AxiosInstance } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true })
		},
	},
})

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers!['Authorization'] = `${Session.get('token')}`
		}
		if (config.method === 'get' || config.method === 'delete') {
			config.params = config.data
			delete config.data
		}
		return config
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加响应拦截器
service.interceptors.response.use(
	(res) => {
		// 对响应数据做点什么
		// `token` 过期或者账号已在别处登录
		// return response.data;
		return res
	},
	(error) => {
		const res = error.response
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时')
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误')
		} else if (res.status === 401) {
			Session.clear() // 清除浏览器全部临时缓存
			window.location.href = '/' // 去登录页
			ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
			return Promise.reject()
		} else if (res.status !== 200) {
			const message = res.data.detail || res.data.message
			if (message) ElMessage.error(message)
		}
		return error
	}
)

// 导出 axios 实例
export default service