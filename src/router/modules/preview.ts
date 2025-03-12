export default [
    {
        path: '/preview/blur-detect',
        name: 'PreviewBlurDetect',
        component: () => import('@/views/Preview/PreviewBlurDetect.vue'),
        meta: {
            requiresAuth: false,
            title: 'PreviewBlurDetect',
        }
    },
];
