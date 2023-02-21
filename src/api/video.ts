import { Pages } from '/@/api/types'
import { PageParams, UserInfo } from '/@/api/user'
import request from '/@/utils/request'

export interface VideoParams extends PageParams {
  keyWord?: string
  state?: number
  userId?: number
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
  recommend: number
  readCount: number
  likeCount: number
  sortValue: number
}

export const getVideoApi = (data: VideoParams) =>
  request<Pages<VideoInfo>>({
    url: '/admin/video',
    data,
  })

export const unpushApi = (data: { videoId: string }) =>
  request<Pages<VideoInfo>>({
    url: '/video/unpush',
    method: 'PUT',
    data,
  })

export const auditApi = (data: { videoId: string }) =>
  request<Pages<VideoInfo>>({
    url: '/video/audit',
    method: 'PUT',
    data,
  })

export const getFromId = (data: { videoId: string }) =>
  request<{ data: VideoInfo & { coverPreview: string } }>({
    url: '/admin/video/fromId',
    data,
  })

export const getCover = (data: { videoId: string }) =>
  request<{ cover: string, coverPreview: string }>({
    url: '/admin/video/cover',
    data,
  })

export const getRanking = (data: { sortValue: number }) =>
  request<{ data: number }>({
    url: '/video/ranking',
    data,
  })

export const putRecommend = (data: { videoId: string, recommend: number }) =>
  request<{ data: number }>({
    url: '/video/recommend',
    method: 'PUT',
    data,
  })
