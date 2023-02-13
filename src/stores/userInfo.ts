import { getInfoApi } from '/@/api/user'
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
      const info = await this.getApiUserInfo()
      if(!info) {
        // @ts-ignore
        // this.userInfos = {}
        // const router = useRouter()
        // console.log(router)
        // router.replace({
        //   name: 'login',
        // })
        const { userInfos } = this
        userInfos.nickname = ''
        userInfos.photo = ''
        userInfos.time = 0
        userInfos.roles = []
        userInfos.authBtnList = []
        Session.remove('token')
        return
      }
      this.userInfos = info
    },
    async getApiUserInfo() {
      const { data, status } = await getInfoApi()
      if(status !== 200) {
        return null
      }
      // 用户信息模拟数据
      return {
        photo: data.photo,
        nickname: data.nickname,
        adminId: data.adminId,
        time: new Date().getTime(),
        roles: data.permissions,
        authBtnList: data.authButton,
      }
    },
  },
})
