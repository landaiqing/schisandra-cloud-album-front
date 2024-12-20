import {createRouter, createWebHistory, Router, RouteRecordRaw} from 'vue-router';
import login from './modules/login';

import useStore from "@/store";
import {message} from "ant-design-vue";
import notFound from "./modules/not_found.ts";
import landing from "./modules/landing.ts";
import mainRouter from "./modules/main_router.ts";
import i18n from "@/locales";
import phone_upload from "@/router/modules/phone_upload.ts";

const routes: Array<RouteRecordRaw> = [
    ...login,
    ...notFound,
    ...landing,
    ...mainRouter,
    ...phone_upload,
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
    }
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    // start();
    const user = useStore().user;
    const token: string | undefined = user.token;
    const userId: string | undefined = user.user.uid;

    // 检查用户是否已登录
    const isLoggedIn: boolean = token !== "" && userId !== "";

    if (to.path === '/login' || to.path === '/qrlogin' || to.path === '/resetpass') {
        if (isLoggedIn) {
            // 如果用户已登录，重定向到主页或其他页面
            next({path: '/main/photo/all'});
        } else {
            next();
        }
    } else if (to.meta.requiresAuth) {
        if (isLoggedIn) {
            next();
        } else {
            message.warn(i18n.global.t('login.pleaseLogin'));
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        }
    } else {
        next();
    }
});


router.afterEach(() => {
    // 关闭进度条
    // close();
});
export default router;
