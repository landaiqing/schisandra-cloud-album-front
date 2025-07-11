export default [
    {
        path: '/preview/blur-detect',
        name: 'PreviewBlurDetect',
        component: () => import('@/views/Preview/PreviewBlurDetect/PreviewBlurDetect.vue'),
        meta: {
            requiresAuth: false,
            title: 'PreviewBlurDetect',
        }
    },
    {
        path: '/preview/ocr',
        name: 'PreviewOcr',
        component: () => import('@/views/Preview/PreviewOCR/PreviewOCR.vue'),
        meta: {
            requiresAuth: false,
            title: 'PreviewOcr',
        }
    },
    {
        path: '/preview/qrcode',
        name: 'PreviewQRCode',
        component: () => import('@/views/Preview/PreviewQRCode/PreviewQRCode.vue'),
        meta: {
            requiresAuth: false,
            title: 'PreviewQRCode',
        }
    },
];
