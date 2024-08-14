export default [
	{
		path: '/test',
		name: 'test',
		component: () => import('@/views/TestTheme.vue'),
		meta: {
            requiresAuth: true,
			title: '测试'
		}
	}
];
