export default [
    {
        path: '/resetpass',
        name: 'resetpass',
        component: () => import('@/views/Forget/ForgetPage.vue'),
        meta: {
            requiresAuth: false,
            title: '重置密码'
        }
    }
];
