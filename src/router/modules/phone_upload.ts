export default [
    {
        path: '/upscale/app',
        name: 'upscaleApp',
        component: () => import('@/views/PhoneUpload/PhoneUpload.vue'),
        meta: {
            requiresAuth: false,
            title: '手机上传'
        }
    }
];
