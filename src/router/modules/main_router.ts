import photo from "@/router/modules/photos.ts";
import albums from "@/router/modules/albums.ts";
import recycling_bin from "@/router/modules/recycling_bin.ts";

export default [
    {
        path: '/main',
        name: 'main',
        redirect: '/main/photos',
        component: () => import('@/views/Main/MainPage.vue'),
        meta: {
            requiresAuth: true,
            title: '主页'
        },
        children: [
            ...photo,
            ...albums,
            ...recycling_bin,
            {
                path: '/main/photo/upscale',
                name: 'upscale',
                component: () => import('@/views/Upscale/index.vue'),
                meta: {
                    requiresAuth: true,
                    title: '图像修复'
                },
            },
            {
                path: '/main/photo/share',
                name: 'share',
                component: () => import('@/views/ImageShare/ImageShare.vue'),
                meta: {
                    requiresAuth: true,
                    title: '快传'
                }
            }

        ]
    }
];
