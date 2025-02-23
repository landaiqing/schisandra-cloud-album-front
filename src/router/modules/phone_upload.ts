export default [
    {
        path: '/main/upscale/phone/app',
        name: 'upscaleApp',
        component: () => import('@/views/Phone/UpscalePhoneUpload/UpscalePhoneUpload.vue'),
        meta: {
            requiresAuth: false,
            title: '手机上传'
        }
    },
    {
        path: '/main/share/phone/app',
        name: 'shareApp',
        component: () => import('@/views/Phone/SharePhoneUpload/SharePhoneUpload.vue'),
        meta: {
            requiresAuth: false,
            title: '手机上传'
        }
    }
];
