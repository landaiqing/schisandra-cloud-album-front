import Phoalbum from "@/views/Album/Phoalbum/Phoalbum.vue";
import PeopleAlbum from "@/views/Album/PeopleAlbum/PeopleAlbum.vue";
import LocationAlbum from "@/views/Album/LocationAlbum/LocationAlbum.vue";
import ThingAlbum from "@/views/Album/ThingAlbum/ThingAlbum.vue";

export default [
    {
        path: '/main/album/albums',
        name: 'albums',
        component: Phoalbum,
        meta: {
            requiresAuth: true,
            title: '相册'
        },
    },
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
        path: '/main/album/location',
        name: 'location',
        component: LocationAlbum,
        meta: {
            requiresAuth: true,
            title: '地点相册'
        },
    },
    {
        path: '/main/album/thing',
        name: 'thing',
        component: ThingAlbum,
        meta: {
            requiresAuth: true,
            title: '事物相册'
        },
    },
];
