import router from '/@/router'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

export const refEl = <T extends abstract new (...args: any) => any>(a?: T) => {
  a
  return ref<InstanceType<T>>()
}

export function randomString(e = 32) {
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789',
    l = t.length
  let n = ''
  for(let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * l))
  return n
}

export function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    const textareaC = document.createElement('textarea')
    textareaC.setAttribute('readonly', 'readonly')
    textareaC.value = text
    document.body.appendChild(textareaC)
    textareaC.select()
    if(document.execCommand) {
      const res = document.execCommand('copy')
      document.body.removeChild(textareaC)
      if(res) {
        ElMessage.success('复制成功')
        return
      }
    }
    ElMessage.error('您的浏览器可能不受支持，请手动复制')
    ElMessage.warning(text)
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

