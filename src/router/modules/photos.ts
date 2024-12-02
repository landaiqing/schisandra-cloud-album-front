import AllPhoto from "@/views/Photograph/AllPhoto/AllPhoto.vue";
import RecentUpload from "@/views/Photograph/RecentUpload/RecentUpload.vue";

export default [
    {
        path: '/main/photo/all',
        name: 'photos',
        component: AllPhoto,
        meta: {
            requiresAuth: true,
            title: '全部照片'
        },
    },
    {
        path: '/main/photo/recent',
        name: 'recent',
        component: RecentUpload,
        meta: {
            requiresAuth: true,
            title: '最近上传'
        },
    },
];
