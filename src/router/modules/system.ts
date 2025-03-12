import Dashboard from '@/views/Admin/System/Pages/Dashboard.vue';
import UserList from '@/views/Admin/System/Pages/UserList.vue';
import PermissionSetting from '@/views/Admin/System/Pages/PermissionSetting.vue';
import RoleManagement from '@/views/Admin/System/Pages/RoleManagement.vue';

export default [
    {
        path: '/admin/login',
        name: 'admin-login',
        component: () => import('@/views/Admin/Auth/Login.vue'),
        meta: {
            requiresAuth: false,
            title: 'Auth Login',
        }
    },
    {
        path: '/admin/system/index',
        name: 'admin-system',
        redirect: '/admin/system/dashboard',
        component: () => import('@/views/Admin/System/Index.vue'),
        meta: {
            requiresAuth: false,
            title: '管理首页',
        },
        children: [
            {
                path: '/admin/system/dashboard',
                name: 'admin-system-dashboard',
                component: Dashboard,
                meta: {
                    requiresAuth: false,
                    title: '管理首页',
                }
            }, {
                path: '/admin/system/user',
                name: 'admin-system-user',
                component: UserList,
                meta: {
                    requiresAuth: false,
                    title: '用户列表',
                }
            },
            {
                path: '/admin/system/permission',
                name: 'admin-system-permission',
                component: PermissionSetting,
                meta: {
                    requiresAuth: false,
                    title: '权限列表',
                }
            },
            {
                path: '/admin/system/role',
                name: 'admin-system-role',
                component: RoleManagement,
                meta: {
                    requiresAuth: false,
                    title: '角色列表',
                }
            },
            {
                path: '/admin/system/basic',
                name: 'admin-system-basic-setting',
                component: () => import('@/views/Admin/System/Pages/BasicSettings.vue'),
                meta: {
                    requiresAuth: false,
                    title: '基本设置',
                }
            },
            {
                path: '/admin/system/security',
                name: 'admin-system-security-setting',
                component: () => import('@/views/Admin/System/Pages/SecuritySettings.vue'),
                meta: {
                    requiresAuth: false,
                    title: '安全设置',
                }
            },
            {
                path: '/admin/system/log',
                name: 'admin-system-log',
                component: () => import('@/views/Admin/System/Pages/SystemLogs.vue'),
                meta: {
                    requiresAuth: false,
                    title: '系统日志',
                }
            },
            {
                path: '/admin/system/analysis',
                name: 'admin-system-analysis',
                component: () => import('@/views/Admin/System/Pages/UserAnalysis.vue'),
                meta: {
                    requiresAuth: false,
                    title: '用户分析',
                }
            },
            {
                path: '/admin/system/visit',
                name: 'admin-system-visit',
                component: () => import('@/views/Admin/System/Pages/VisitStatistics.vue'),
                meta: {
                    requiresAuth: false,
                    title: '访问统计',
                }
            },
            {
                path: '/admin/system/storage',
                name: 'admin-system-storage',
                component: () => import('@/views/Admin/System/Pages/StorageManagement.vue'),
                meta: {
                    requiresAuth: false,
                    title: '存储管理',
                }
            },

        ]
    }


];


