export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/LoginPage.vue'),
        meta: {
            requiresAuth: false,
            title: '登录页'
        }
    },
    {
        path: '/qrlogin',
        name: 'qrlogin',
        component: () => import('@/views/QRLogin/QRLogin.vue'),
        meta: {
            requiresAuth: false,
            title: '扫码登录'
        }
    },
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
