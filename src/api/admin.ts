import { Pages } from '/@/api/types'
import { PageParams } from '/@/api/user'
import request from '/@/utils/request'

export const loginApi = (data: { nickname: string; password: string }) =>
  request<{ token: string; authorization: string }>({
    url: '/admin/login',
    method: 'POST',
    data,
  })

export const registerApi = (data: { nickname: string; password: string }) =>
  request<{ insertId: number }>({
    url: 'admin/register',
    method: 'POST',
    data,
  })

export const getInfoApi = () =>
  request<{
    adminId: string
    permissions: string[]
    nickname: string
    photo: string
    authButton: string[]
    permissionsDescription: string[]
  }>({
    url: '/admin/info',
  })

export interface AdminListInfo {
  adminId: number
  nickname: string
  permissions: string[]
  photo: string
  permissionsDescription: string[]
}

interface ListParams extends PageParams {
  keyWord?: string
  permission?: string
}

export const getListApi = (data: ListParams) =>
  request<Pages<AdminListInfo>>({
    url: '/admin/list',
    data,
  })

export const removeAdminApi = (data: { adminId: number }) =>
  request<{}>({
    url: '/admin',
    method: 'DELETE',
    data,
  })

export const getFromIdApi = (data: { adminId: number }) =>
  request({
    url: '/admin/fromId',
    data,
  })

export const resetPassApi = (data: { adminId: number }) =>
  request({
    url: '/admin/resetPassword',
    method: 'POST',
    data,
  })

export const putPhotoApi = (data: { photo: string }) =>
  request({
    url: '/admin/photo',
    method: 'PUT',
    data,
  })

export const putNicknameApi = (data: { nickname: string }) =>
  request({
    url: '/admin/nickname',
    method: 'PUT',
    data,
  })

export const putPasswordApi = (data: {
  oldPassword: string
  newPassword: string
}) =>
  request({
    url: '/admin/password',
    method: 'PUT',
    data,
  })
