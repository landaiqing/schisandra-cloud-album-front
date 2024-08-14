export default [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/Landing/LandingPage.vue'),
        meta: {
            requiresAuth: false,
            title: '首页'
        }
    }
];
