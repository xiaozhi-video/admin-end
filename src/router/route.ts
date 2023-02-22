import { RouteRecordRaw } from 'vue-router'

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		title?: string
		isLink?: string
		isHide?: boolean
		isKeepAlive?: boolean
		isAffix?: boolean
		isIframe?: boolean
		roles?: string[]
		icon?: string
	}
}

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('/@/views/home/index.vue'),
				meta: {
					title: 'message.router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					roles: ['superAdmin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/myInfo',
				name: 'myInfo',
				component: () => import('/@/views/myInfo/index.vue'),
				meta: {
					title: 'message.router.myInfo',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					roles: ['common'],
				},
			},
			{
				path: '/video',
				name: 'videoIndex',
				redirect: '/video/list',
				meta: {
					title: 'message.router.videoIndex',
					roles: ['superAdmin', 'videoList', 'videoAudit', 'videoClassify'],
					icon: 'fa fa-video-camera',
					isKeepAlive: true,
				},
				children: [
					{
						path: '/video/list',
						name: 'videoList',
						component: () => import('/@/views/video/list/index.vue'),
						meta: {
							title: 'message.router.videoList',
							roles: ['superAdmin', 'videoList'],
							icon: 'fa fa-list-ul',
							isKeepAlive: true,
						},
					},
					{
						path: '/video/audit',
						name: 'videoAudit',
						component: () => import('/@/views/video/audit/index.vue'),
						meta: {
							title: 'message.router.videoAudit',
							roles: ['superAdmin', 'videoAudit'],
							icon: 'fa fa-search',
							isKeepAlive: true,
						},
					},
					{
						path: '/video/classify',
						name: 'videoClassify',
						component: () => import('/@/views/video/classify/index.vue'),
						meta: {
							title: 'message.router.videoClassify',
							isHide: false,
							isKeepAlive: true,
							roles: ['superAdmin', 'videoClassify'],
							icon: 'fa fa-th',
						},
					},
					{
						path: '/video/play',
						name: 'videoPlay',
						component: () => import('/@/views/video/play/index.vue'),
						meta: {
							title: 'message.router.videoPlay',
							isHide: true,
							isKeepAlive: true,
							roles: ['superAdmin', 'videoList', 'videoAudit'],
							icon: 'fa fa-th',
						},
					},
				],
			},
			{
				path: '/user',
				name: 'userIndex',
				redirect: '/user/list',
				meta: {
					title: 'message.router.userIndex',
					icon: 'fa fa-user-o',
					isKeepAlive: true,
					roles: ['superAdmin', 'userList'],
				},
				children: [
					{
						path: '/user/list',
						name: 'userList',
						component: () => import('/@/views/user/list/index.vue'),
						meta: {
							title: 'message.router.userList',
							isKeepAlive: true,
							roles: ['superAdmin', 'userList'],
							icon: 'fa fa-list-ul',
						},
					},
				],
			},
			{
				path: '/operation',
				name: 'operationIndex',
				redirect: '/operation/homeRecommend',
				meta: {
					title: 'message.router.operationIndex',
					icon: 'fa fa-sellsy',
					isKeepAlive: true,
					roles: ['superAdmin', 'homeRecommend', 'homeCarousel'],
				},
				children: [
					{
						path: '/operation/homeRecommend',
						name: 'homeRecommend',
						component: () => import('/@/views/operation/homeRecommend/index.vue'),
						meta: {
							title: 'message.router.operationHomeRecommend',
							isKeepAlive: true,
							roles: ['superAdmin', 'homeRecommend'],
							icon: 'fa fa-thumbs-o-up',
						},
					},
					{
						path: '/operation/homeCarousel',
						name: 'homeCarousel',
						component: () => import('/@/views/operation/homeCarousel/index.vue'),
						meta: {
							title: 'message.router.operationHomeCarousel',
							isKeepAlive: true,
							roles: ['superAdmin', 'homeCarousel'],
							icon: 'fa fa-retweet',
						},
					},
				],
			},
			{
				path: '/adminer',
				name: 'adminer',
				redirect: '/adminer/list',
				meta: {
					title: 'message.router.adminerIndex',
					icon: 'fa fa-user-secret',
					isKeepAlive: true,
					roles: ['superAdmin', 'adminerList', 'adminerPermission'],
				},
				children: [
					{
						path: '/adminer/list',
						name: 'adminerList',
						component: () => import('/@/views/adminer/list/index.vue'),
						meta: {
							title: 'message.router.adminerList',
							isHide: false,
							isKeepAlive: true,
							roles: ['superAdmin', 'adminerList'],
							icon: 'fa fa-th',
						},
					},
					{
						path: '/adminer/edit',
						name: 'adminerEdit',
						component: () => import('/@/views/adminer/edit/index.vue'),
						meta: {
							title: 'message.router.adminerEdit',
							isHide: true,
							isKeepAlive: false,
							roles: ['superAdmin', 'adminerEdit'],
							icon: 'fa fa-th',
						},
					},
				],
			},
		],
	},
]

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
]

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	/**
	 * 提示：写在这里的为全屏界面，不建议写在这里
	 * 请写在 `dynamicRoutes` 路由数组中
	 */
	// {
	// 	path: '/visualizingDemo1',
	// 	name: 'visualizingDemo1',
	// 	component: () => import('/@/views/visualizing/demo1.vue'),
	// 	meta: {
	// 		title: 'message.router.visualizingLinkDemo1',
	// 	},
	// },
]
