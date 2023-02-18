import { ref } from 'vue'

export const refEl = <T extends abstract new (...args: any) => any>(a?: T) => {
  a
  return ref<InstanceType<T>>()
}
