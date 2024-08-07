import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

import login from './modules/login'

const routes: Array<RouteRecordRaw> = [...login]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
