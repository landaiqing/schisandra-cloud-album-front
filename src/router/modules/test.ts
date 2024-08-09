export default [
	{
		path: '/test',
		name: 'test',
		component: () => import('@/views/TestTheme.vue'),
		meta: {
            requiresAuth: false,
			title: '测试'
		}
	}
];
