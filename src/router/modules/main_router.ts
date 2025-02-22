import photo from "@/router/modules/photos.ts";
import albums from "@/router/modules/albums.ts";
import recycling_bin from "@/router/modules/recycling_bin.ts";
import share from "@/router/modules/share.ts";
import upscale from "@/router/modules/upscale.ts";

export default [
    {
        path: '/main',
        name: 'main',
        redirect: '/main/photo/all',
        component: () => import('@/views/Main/MainPage.vue'),
        meta: {
            requiresAuth: true,
            title: '主页'
        },
        children: [
            ...photo,
            ...albums,
            ...recycling_bin,
            ...share,
            ...upscale,

        ]
    }, {
        path: '/main/share/list/:id',
        name: 'share-list',
        component: () => import('@/views/Share/ShareViewList/index.vue'),
        meta: {
            requiresAuth: true,
            title: '分享列表'
        },
    }

];
