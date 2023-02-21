import { getInfoApi } from '/@/api/admin'
import { Session } from '/@/utils/storage'
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
      const { data, status } = await getInfoApi()
      if(status !== 200) {
        if(status === 401) {
          const { userInfos } = this
          userInfos.nickname = ''
          userInfos.photo = ''
          userInfos.time = 0
          userInfos.roles = []
          userInfos.authBtnList = []
          Session.remove('token')
        }
        return
      }
      data.permissions.push('common')
      const info = {
        photo: data.photo,
        nickname: data.nickname,
        adminId: data.adminId,
        time: new Date().getTime(),
        roles: data.permissions,
        authBtnList: data.authButton,
      }
      this.userInfos = info
    },
  },
})
