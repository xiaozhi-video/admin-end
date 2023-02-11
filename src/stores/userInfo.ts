import { getInfoApi } from '/@/api/user'
import { defineStore } from 'pinia'

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			nickname: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			this.userInfos = await this.getApiUserInfo();
		},
		// 模拟接口数据
		// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
		async getApiUserInfo() {
			const { data } = await getInfoApi();
			// 用户信息模拟数据
			return {
				photo: data.photo,
				nickname: data.nickname,
				adminId: data.adminId,
				time: new Date().getTime(),
				roles: data.permissions,
				authBtnList: data.authButton,
			};
		},
	},
});
