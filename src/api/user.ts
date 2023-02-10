import { defHttp } from '/@/utils/http/axios'

export const login = (data: { nickname: string; password: string }) =>
  defHttp.post<{ token: string; authorization: string }>({
    url: 'admin/login',
    data,
  })

export const register = (data: { nickname: string; password: string }) =>
  defHttp.post({
    url: 'admin/register',
    data,
  })

export const getPermissions = (data: { nickname: string }) =>
  defHttp.get({
    url: 'admin/permissions',
    data,
  })

export const setPermissions = (data: { nickname: string }) =>
  defHttp.post({
    url: 'admin/permissions',
    data,
  })
