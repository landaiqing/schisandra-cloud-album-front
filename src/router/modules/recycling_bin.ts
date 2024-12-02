import RecyclingBin from "@/views/RecyclingBin/RecyclingBin.vue";

export default [
    {
        path: '/main/recycling',
        name: 'recycling',
        component: RecyclingBin,
        meta: {
            requiresAuth: true,
            title: '回收站'
        },
    },
];
