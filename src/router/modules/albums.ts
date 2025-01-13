import PhoalbumPhoalbum from "@/views/Album/Phoalbum/Phoalbum.vue";
import PeopleAlbumPeopleAlbum from "@/views/Album/PeopleAlbum/PeopleAlbum.vue";
import LocationAlbum from "@/views/Album/LocationAlbum/LocationAlbumList.vue";
import LocationAlbumIndex from "@/views/Album/LocationAlbum/LocationAlbum.vue";
import ThingAlbum from "@/views/Album/ThingAlbum/ThingAlbumList.vue";
import ThingAlbumThingAlbum from "@/views/Album/ThingAlbum/ThingAlbum.vue";
import Phoalbum from "@/views/Album/Phoalbum/PhoalbumList.vue";
import PeopleAlbum from "@/views/Album/PeopleAlbum/PeopleAlbumList.vue";
import PhoalbumDetail from "@/views/Album/Phoalbum/PhoalbumDetail.vue";
import PeopleAlbumDetail from "@/views/Album/PeopleAlbum/PeopleAlbumDetail.vue";
import LocationAlbumDetail from "@/views/Album/LocationAlbum/LocationAlbumDetail.vue";
import ThingAlbumDetail from "@/views/Album/ThingAlbum/ThingAlbumDetail.vue";

export default [
    {
        path: '/main/album/albums',
        component: PhoalbumPhoalbum,
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
        component: PeopleAlbumPeopleAlbum,
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
        component: ThingAlbumThingAlbum,
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
