export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/LoginPage.vue'),
        meta: {
            requiresAuth: false,
            title: '登录页'
        }
    }
];
