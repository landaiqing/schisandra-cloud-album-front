import photo from "@/router/modules/photos.ts";
import albums from "@/router/modules/albums.ts";
import recycling_bin from "@/router/modules/recycling_bin.ts";
import share from "@/router/modules/share.ts";
import upscale from "@/router/modules/upscale.ts";
import image_bed from "@/router/modules/image_bed.ts";

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
            ...image_bed,
            {
                path: '/main/photo/search/list',
                name: 'photo-search-list',
                component: () => import('@/views/Photograph/SearchResult/SearchResult.vue'),
                meta: {
                    requiresAuth: true,
                    title: '搜索结果'
                }
            }
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
