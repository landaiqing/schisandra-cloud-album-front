import UserCenterHome from "@/views/User/PersonalCenter/components/UserCenterHome/UserCenterHome.vue";
import UserCenterDynamic from "@/views/User/PersonalCenter/components/UserCenterDynamic/UserCenterDynamic.vue";
import UserCenterSetting from "@/views/User/PersonalCenter/components/UserCenterSetting/UserCenterSetting.vue";

import AccountSettingHome from "@/views/User/AccountSetting/components/AccountSettingHome/AccountSettingHome.vue";
import AccountSettingInfo from "@/views/User/AccountSetting/components/AccountSettingInfo/AccountSettingInfo.vue";
import AccountSettingStorage
    from "@/views/User/AccountSetting/components/AccountSettingStorage/AccountSettingStorage.vue";
import AccountSettingBackup
    from "@/views/User/AccountSetting/components/AccountSettingBackup/AccountSettingBackup.vue";

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
            },
            {
                path: '/main/user/setting/backup',
                name: 'AccountSettingBackup',
                component: AccountSettingBackup,
                meta: {
                    requiresAuth: true,
                    title: '图像备份'
                },
            },
            {
                path: '/main/user/setting/task',
                name: 'AccountSettingTask',
                component: () => import('@/views/User/AccountSetting/components/AccountSettingTask/AccountSettingTask.vue'),
                meta: {
                    requiresAuth: true,
                    title: '定时任务'
                },
            },
            {
                path: '/main/user/setting/log',
                name: 'AccountSettingLog',
                component: () => import('@/views/User/AccountSetting/components/AccountSettingLog/AccountSettingLog.vue'),
                meta: {
                    requiresAuth: true,
                    title: '执行记录'
                },
            }
        ],
    }
];
