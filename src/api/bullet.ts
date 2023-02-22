import request from '/@/utils/request'

export interface bulletInfo {
	id: number
	text: string
	color: string
	time: number
}

export const delBulletApi = (data: { id: number }) =>
	request<{}>({
		url: 'bullet',
		method: 'DELETE',
		data,
	})

export const getBulletApi = (data: { videoId: string }) =>
	request<{ data: bulletInfo[] }>({
		url: 'bullet',
		data,
	})
