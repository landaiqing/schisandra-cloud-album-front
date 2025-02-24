export default [
    {
        path: '/main/photo/upscale',
        name: 'upscale',
        component: () => import('@/views/Upscale/index.vue'),
        meta: {
            requiresAuth: true,
            title: '图像修复'
        },
    },
];
