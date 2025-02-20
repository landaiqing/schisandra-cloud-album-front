export default [
    {
        path: '/upscale/app',
        name: 'upscaleApp',
        component: () => import('@/views/Phone/UpscalePhoneUpload/UpscalePhoneUpload.vue'),
        meta: {
            requiresAuth: false,
            title: '手机上传'
        }
    }
];
