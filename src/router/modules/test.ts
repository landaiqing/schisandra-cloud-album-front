export default [
	{
		path: '/test',
		name: 'test',
		component: () => import('@/views/TestTheme.vue'),
		meta: {
			title: '测试'
		}
	}
];
