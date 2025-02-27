import UserCenterHome from "@/views/User/PersonalCenter/components/UserCenterHome/UserCenterHome.vue";
import UserCenterDynamic from "@/views/User/PersonalCenter/components/UserCenterDynamic/UserCenterDynamic.vue";
import UserCenterInfo from "@/views/User/PersonalCenter/components/UserCenterInfo/UserCenterInfo.vue";
import UserCenterAnalysis from "@/views/User/PersonalCenter/components/UserCenterAnalysis/UserCenterAnalysis.vue";
import UserCenterShare from "@/views/User/PersonalCenter/components/UserCenterShare/UserCenterShare.vue";
import UserCenterSetting from "@/views/User/PersonalCenter/components/UserCenterSetting/UserCenterSetting.vue";

import AccountSettingHome from "@/views/User/AccountSetting/components/AccountSettingHome/AccountSettingHome.vue";
import AccountSettingInfo from "@/views/User/AccountSetting/components/AccountSettingInfo/AccountSettingInfo.vue";
import AccountSettingStorage from "@/views/User/AccountSetting/components/AccountSettingStorage/AccountSettingStorage.vue";
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
                name: 'userCenterHome',
                component: UserCenterHome,
                meta: {
                    requiresAuth: true,
                    title: '主页'
                },
            },
            {
                path: '/main/user/center/dynamic',
                name: 'UserCenterDynamic',
                component: UserCenterDynamic,
                meta: {
                    requiresAuth: true,
                    title: '动态'
                },
            },
            {
                path: '/main/user/center/info',
                name: 'UserCenterInfo',
                component: UserCenterInfo,
                meta: {
                    requiresAuth: true,
                    title: '个人信息'
                },
            },
            {
                path: '/main/user/center/analysis',
                name: 'UserCenterAnalysis',
                component: UserCenterAnalysis,
                meta: {
                    requiresAuth: true,
                    title: '数据分析'
                },
            },
            {
                path: '/main/user/center/share',
                name: 'UserCenterShare',
                component: UserCenterShare,
                meta: {
                    requiresAuth: true,
                    title: '我的分享'
                },
            },
            {
                path: '/main/user/center/setting',
                name: 'UserCenterSetting',
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
        redirect: '/main/user/setting/home',
        component: () => import('@/views/User/AccountSetting/AccountSetting.vue'),
        meta: {
            requiresAuth: true,
            title: '账户设置'
        },
        children: [
            {
                path: '/main/user/setting/home',
                name: 'AccountSettingHome',
                component: AccountSettingHome,
                meta: {
                    requiresAuth: true,
                    title: '主页'
                },
            },
            {
                path: '/main/user/setting/info',
                name: 'AccountSettingInfo',
                component: AccountSettingInfo,
                meta: {
                    requiresAuth: true,
                    title: '个人信息'
                },
            },
            {
                path: '/main/user/setting/storage',
                name: 'AccountSettingStorage',
                component: AccountSettingStorage,
                meta: {
                    requiresAuth: true,
                    title: '存储管理'
                },
            }
        ],
    }
];
