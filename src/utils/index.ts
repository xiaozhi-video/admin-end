import { ref } from 'vue'

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
