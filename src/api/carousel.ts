import request from '/@/utils/request'

export interface CarouselInfo {
  id: string
  image: string
  url: string
  imagePreview: string
  index?: number
}

export const getCarouselApi = () =>
  request<{
    data: CarouselInfo[]
  }>({
    url: '/carousel',
  })

export const putCarouselApi = (data: { carousel: Omit<CarouselInfo, 'imagePreview'> [] }) =>
  request<{}>({
    url: '/carousel',
    method: 'PUT',
    data,
  })

