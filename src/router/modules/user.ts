import UserCenterHome from "@/views/User/PersonalCenter/components/UserCenterHome/UserCenterHome.vue";
import UserCenterDynamic from "@/views/User/PersonalCenter/components/UserCenterDynamic/UserCenterDynamic.vue";
import UserCenterInfo from "@/views/User/PersonalCenter/components/UserCenterInfo/UserCenterInfo.vue";
import UserCenterAnalysis from "@/views/User/PersonalCenter/components/UserCenterAnalysis/UserCenterAnalysis.vue";
import UserCenterShare from "@/views/User/PersonalCenter/components/UserCenterShare/UserCenterShare.vue";
import UserCenterSetting from "@/views/User/PersonalCenter/components/UserCenterSetting/UserCenterSetting.vue";
export default [
    {

        path: '/main/user/center',
        name: 'userCenter',
        redirect: '/main/user/center/home',
        component: () => import('@/views/User/PersonalCenter/PersonalCenter.vue'),
        meta: {
            requiresAuth: true,
            title: '个人中心'
        },
        children: [
            {
                path: '/main/user/center/home',
                name: 'home',
                component: UserCenterHome,
                meta: {
                    requiresAuth: true,
                    title: '主页'
                },
            },
            {
                path: '/main/user/center/dynamic',
                name: 'dynamic',
                component: UserCenterDynamic,
                meta: {
                    requiresAuth: true,
                    title: '动态'
                },
            },
            {
                path: '/main/user/center/info',
                name: 'info',
                component: UserCenterInfo,
                meta: {
                    requiresAuth: true,
                    title: '个人信息'
                },
            },
            {
                path: '/main/user/center/analysis',
                name: 'analysis',
                component: UserCenterAnalysis,
                meta: {
                    requiresAuth: true,
                    title: '数据分析'
                },
            },
            {
                path: '/main/user/center/share',
                name: 'share',
                component: UserCenterShare,
                meta: {
                    requiresAuth: true,
                    title: '我的分享'
                },
            },
            {
                path: '/main/user/center/setting',
                name: 'setting',
                component: UserCenterSetting,
                meta: {
                    requiresAuth: true,
                    title: '设置'
                },
            }
        ]
    },
    {
        path: '/main/user/setting',
        name: 'userSetting',
        component: () => import('@/views/User/AccountSetting/AccountSetting.vue'),
        meta: {
            requiresAuth: true,
            title: '账户设置'
        }
    }
];
