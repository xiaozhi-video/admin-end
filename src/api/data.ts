import request from '/@/utils/request'

export interface HalInfo {
  date: string
  like: number
  history: number
}

export const hal7DataApi = () =>
  request<{
    data: HalInfo[]
  }>({
    url: 'data/hal7',
  })
