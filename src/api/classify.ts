import request from '/@/utils/request'

export interface ClassifyInfo {
	name: string
	icon: string
}

export const getClassifyListApi = () =>
	request<{
		data: ClassifyInfo[]
	}>({
		url: '/classify',
	})

export const addClassifyApi = (data: { name: string; icon: string }) =>
	request<{}>({
		url: '/classify',
		method: 'POST',
		data,
	})

export const delClassifyApi = (data: { name: string }) =>
	request<{}>({
		url: '/classify',
		method: 'DELETE',
		data,
	})
