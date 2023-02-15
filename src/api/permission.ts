import request from '/@/utils/request'

export interface Permission {
  permissionId: string,
  description: string
}


export const getPermissionsApi = () =>
  request<{ data: Permission[] }>({
    url: '/permission',
  })

export const putPermissionApi = (data: { adminId: number, permissions: string[] }) =>
  request<{}>({
    url: '/permission',
    method: 'PUT',
    data,
  })
