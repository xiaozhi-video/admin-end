import request from '/@/utils/request'

export interface PermissionInfo {
  permissionId: string,
  description: string
}


export const getPermissionsApi = () =>
  request<{ data: PermissionInfo[] }>({
    url: '/permission',
  })

export const putPermissionApi = (data: { adminId: number, permissions: string[] }) =>
  request<{}>({
    url: '/permission',
    method: 'PUT',
    data,
  })
