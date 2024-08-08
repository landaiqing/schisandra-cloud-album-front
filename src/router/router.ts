import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import login from './modules/login';
import test from "@/router/modules/test.ts";


const routes: Array<RouteRecordRaw> = [
    ...login,
    ...test

];

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
