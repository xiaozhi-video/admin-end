import request from '/@/utils/request'

export interface CarouselInfo {
	id: string
	image: string
	imagePreview: string
	index?: number
	url?: string
	videoId?: string
}

export const getCarouselApi = () =>
	request<{
		data: CarouselInfo[]
	}>({
		url: '/carousel',
	})

export const putCarouselApi = (data: { carousel: Omit<CarouselInfo, 'imagePreview'>[] }) =>
	request<{}>({
		url: '/carousel',
		method: 'PUT',
		data,
	})
