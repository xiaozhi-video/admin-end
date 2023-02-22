import { ElMessage } from 'element-plus'

export default <F extends Function>(callBack: F) => {
	// @ts-ignore
	const c: F = (...args) => {
		try {
			return callBack(...args)
		} catch (e) {
			ElMessage.error('发生未知异常，将为您重启页面')
			setTimeout(() => {
				window.location.reload()
			}, 3000)
		}
	}
	return c
}
