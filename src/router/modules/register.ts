export default [
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register/RegisterPage.vue'),
        meta: {
            requiresAuth: false,
            title: '注册页'
        }
    }
];
