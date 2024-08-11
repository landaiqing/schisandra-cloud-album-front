export default [
    {
        path: '/test2',
        name: 'test2',
        component: () => import('@/views/TestI18n.vue'),
        meta: {
            requiresAuth: false,
            title: '测试'
        }
    }
];
