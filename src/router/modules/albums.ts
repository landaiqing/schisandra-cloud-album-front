import PhoalbumIndex from "@/views/Album/Phoalbum/Index.vue";
import PeopleAlbumIndex from "@/views/Album/PeopleAlbum/Index.vue";
import LocationAlbum from "@/views/Album/LocationAlbum/LocationAlbum.vue";
import LocationAlbumIndex from "@/views/Album/LocationAlbum/Index.vue";
import ThingAlbum from "@/views/Album/ThingAlbum/ThingAlbum.vue";
import ThingAlbumIndex from "@/views/Album/ThingAlbum/Index.vue";
import Phoalbum from "@/views/Album/Phoalbum/Phoalbum.vue";
import PeopleAlbum from "@/views/Album/PeopleAlbum/PeopleAlbum.vue";
import PhoalbumDetail from "@/views/Album/Phoalbum/Detail.vue";
import PeopleAlbumDetail from "@/views/Album/PeopleAlbum/Detail.vue";
import LocationAlbumDetail from "@/views/Album/LocationAlbum/Detail.vue";
import ThingAlbumDetail from "@/views/Album/ThingAlbum/Detail.vue";

export default [
    {
        path: '/main/album/albums',
        component: PhoalbumIndex,
        redirect: '/main/album/albums',
        children: [
            {
                path: '/main/album/albums',
                name: 'album',
                component: Phoalbum,
                meta: {
                    requiresAuth: true,
                    title: '相册'
                },
            },
            {
                path: '/main/album/albums/:id',
                name: 'albumList',
                component: PhoalbumDetail,
                meta: {
                    requiresAuth: true,
                    title: '相册'
                },
            }
        ]
    },
    {
        path: '/main/album/people',
        component: PeopleAlbumIndex,
        redirect: '/main/album/people',
        children: [
            {
                path: '/main/album/people',
                name: 'people',
                component: PeopleAlbum,
                meta: {
                    requiresAuth: true,
                    title: '人物相册'
                },
            },
            {
                path: '/main/album/people/:id',
                name: 'peopleList',
                component: PeopleAlbumDetail,
                meta: {
                    requiresAuth: true,
                    title: '人物相册'
                },
            }
        ]
    },
    {
        path: '/main/album/location',
        component: LocationAlbumIndex,
        redirect: '/main/album/location',
        children: [
            {
                path: '/main/album/location',
                name: 'location',
                component: LocationAlbum,
                meta: {
                    requiresAuth: true,
                    title: '地点相册'
                },
            },
            {
                path: '/main/album/location/:id',
                name: 'locationList',
                component: LocationAlbumDetail,
                meta: {
                    requiresAuth: true,
                    title: '地点相册'
                },
            }
        ]
    },
    {
        path: '/main/album/thing',
        component: ThingAlbumIndex,
        redirect: '/main/album/thing',
        children: [
            {
                path: '/main/album/thing',
                name: 'thing',
                component: ThingAlbum,
                meta: {
                    requiresAuth: true,
                    title: '事物相册'
                },
            },
            {
                path: '/main/album/thing/:id',
                name: 'thingList',
                component: ThingAlbumDetail,
                meta: {
                    requiresAuth: true,
                    title: '事物相册'
                },
            }
        ]
    },
];
