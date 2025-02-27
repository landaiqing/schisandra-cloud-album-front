export default [
    {
        path: '/main/photo/share',
        name: 'quick-share',
        component: () => import('@/views/Share/ImageShare/ImageShare.vue'),
        meta: {
            requiresAuth: true,
            title: '快传'
        }
    }
];
