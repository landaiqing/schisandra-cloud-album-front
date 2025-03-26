import ImageBed from '@/views/ImageBed/index.vue';

export default [
    {
        path: '/main/photo/image-bed',
        name: 'image-bed',
        component: ImageBed,
        meta: {
            requiresAuth: true,
            title: '图床'
        },
    },
];
