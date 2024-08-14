/* eslint-disable */
// @ts-nocheck
import {createRouter, createWebHistory, Router, RouteRecordRaw} from 'vue-router';
import login from './modules/login';
import test from "@/router/modules/test.ts";
import test2 from "@/router/modules/testI18n.ts";
import useStore from "@/store";
import {message} from "ant-design-vue";
import {close, start} from '@/components/Nprogress/nprogress.ts';
import notFound from "@/router/modules/notFound.ts";
import landing from "@/router/modules/landing.ts";


const routes: Array<RouteRecordRaw> = [
    ...login,
    ...notFound,
    ...landing,
    ...test,
    ...test2,
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
        hidden: true
    }
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    start();
    if (to.meta.requiresAuth) {
        const user = useStore().user;
        const token: string | undefined = user.user.refreshToken;
        const userId: string | undefined = user.user.userId;
        if (token !== "" && userId !== "") {
            next();
        } else {
            message.warn('请先登录').then();
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
    close();
});
export default router;
