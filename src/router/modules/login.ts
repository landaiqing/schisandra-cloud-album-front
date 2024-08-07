export default [
	{
		path: '/',
		name: 'login',
		component: () => import('@/views/login/LoginPage.vue'),
		meta: {
			title: '登录页'
		}
	}
]
