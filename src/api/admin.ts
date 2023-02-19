import { Pages } from '/@/api/types'
import { PageParams } from '/@/api/user'
import request from '/@/utils/request'

export const loginApi = (data: { nickname: string; password: string }) =>
  request<{ token: string; authorization: string }>({
    url: '/admin/login',
    method: 'POST',
    data,
  })

export const registerApi = (data: { nickname: string, password: string }) =>
  request<{ insertId: number }>({
    url: 'admin/register',
    method: 'POST',
    data,
  })

export const getInfoApi = () =>
  request<{
    adminId: string;
    permissions: string[];
    nickname: string;
    photo: string;
    authButton: string[];
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

export const getListApi = (data: { keyWord?: string; permission?: string, } & PageParams) =>
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
    data
  })
