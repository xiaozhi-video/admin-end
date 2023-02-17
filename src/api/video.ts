import { Pages } from '/@/api/types'
import { UserInfo } from '/@/api/user'
import request from '/@/utils/request'

export interface VideoParams {
  keyWord?: string
  state?: number
  userId?: number
  pageNumber?: number
  pageSize?: number
}

export interface VideoInfo {
  videoId: string
  cover: string
  title: string
  describe: string
  classify: string
  videoUrl: string
  state: number
  createdAt: string
  user: UserInfo
}

export const getVideoApi = (data: VideoParams) =>
  request<Pages<VideoInfo>>({
    url: 'admin/video',
    data,
  })

export const unpushApi = (data: { videoId: string }) =>
  request<Pages<VideoInfo>>({
    url: 'video/unpush',
    data,
  })

export const getFromId = (data: { videoId: string }) =>
  request<{data: VideoInfo}>({
    url: '/admin/video/fromId',
    data
  })
