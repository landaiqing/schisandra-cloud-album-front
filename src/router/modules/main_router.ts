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
            ...recycling_bin

        ]
    }
];
