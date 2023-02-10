import { defHttp } from '/@/utils/http/axios'

export const addClassify = (data: { name: string }) => defHttp.post<{}>({ url: '/classify', data })

export const removeClassify = (data: { name: string }) =>
  defHttp.delete<{}>({ url: '/classify', data })
