import request from '/@/utils/request';

export const loginApi = (data: { nickname: string; password: string }) =>
	request<{ token: string; authorization: string }>({
		url: '/admin/login',
		method: 'POST',
		data,
	});

export const getInfoApi = () =>
	request<{
		adminId: string;
		permissions: string[];
		nickname: string;
		photo: string;
		authButton: string[];
	}>({
		url: '/admin/info',
	});
