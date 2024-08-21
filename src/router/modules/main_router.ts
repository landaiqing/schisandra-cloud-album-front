export default [
    {
        path: '/main',
        name: 'main',
        component: () => import('@/views/Main/MainPage.vue'),
        meta: {
            requiresAuth: true,
            title: '主页'
        }
    }
];
