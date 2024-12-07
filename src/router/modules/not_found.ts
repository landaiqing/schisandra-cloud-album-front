export default [
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/NotFound.vue'),
        meta: {
            requiresAuth: false,
            title: '404'
        }
    }
];
