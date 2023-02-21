import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import router from '/@/router'

export const refEl = <T extends abstract new (...args: any) => any>(a?: T) => {
  a
  return ref<InstanceType<T>>()
}

export function randomString(e = 32) {
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
    l = t.length
  let n = ""
  for(let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * l))
  return n
}

export function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  })
}

export function toPlay(videoId: string) {
  router.push({
    name: 'videoPlay',
    query: {
      videoId,
    },
  })
}
