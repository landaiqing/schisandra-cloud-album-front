export default [
    {
        path: '/qrlogin',
        name: 'qrlogin',
        component: () => import('@/views/QRLogin/QRLogin.vue'),
        meta: {
            requiresAuth: false,
            title: '扫码登录'
        }
    }
];
