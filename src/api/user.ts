import request from '/@/utils/request'

export interface PageParams {
  pageNumber: number,
  pageSize: number
}

export interface UserInfo {
  userId: number
  nickname: string
  signature: string
  avatar: string
  banned: number
  createdAt: string
}

export interface UserProps extends PageParams {
  banned?: number
  keyWord?: string
}

export const getUserList = (data: UserProps) =>
  request({
    url: '/user/list',
    data,
  })

export const putUserBanned = (data: { banned: number, userId: number }) =>
  request({
    url: '/user/banned',
    method: 'PUT',
    data,
  })
