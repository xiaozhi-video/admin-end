import request from '/@/utils/request'

export const uploadImageApi = (data: FormData) => request<{ path: string, url: string, hash: string }>({
  url: '/upload/image',
  method: 'POST',
  headers: {
    contentType: 'multipart/form-data'
  },
  data
})
