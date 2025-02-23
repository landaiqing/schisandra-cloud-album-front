export default [
    {
        path: '/main/photo/phone',
        name: 'upscale',
        component: () => import('@/views/Upscale/index.vue'),
        meta: {
            requiresAuth: true,
            title: '图像修复'
        },
    },
];
