/* eslint-disable */
// @ts-nocheck
import {createRouter, createWebHistory, Router, RouteRecordRaw} from 'vue-router';
import login from './modules/login';
import test from "@/router/modules/test.ts";
import test2 from "@/router/modules/testI18n.ts";
import useStore from "@/store";
import {message} from "ant-design-vue";
import {close, start} from '@/utils/nprogress/nprogress.ts';
import qrlogin from "@/router/modules/qrlogin.ts";
import resetpass from "@/router/modules/resetpass.ts";
import notFound from "@/router/modules/notFound.ts";


const routes: Array<RouteRecordRaw> = [
    ...login,
    ...qrlogin,
    ...resetpass,
    ...notFound,
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
        const token: string | undefined = user.getUser()?.token;
        const userId: string | undefined = user.getUser()?.userId;
        if (token !== undefined && userId !== undefined) {
            next();
        } else {
            message.warn('请先登录').then();
            next({
                path: '/',
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
