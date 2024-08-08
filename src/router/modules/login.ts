export default [
	{
		path: '/',
		name: 'login',
		component: () => import('@/views/Login/LoginPage.vue'),
		meta: {
			title: '登录页'
		}
	}
];
