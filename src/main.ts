import {createApp} from 'vue'
import App from './App.vue'
import '@/assets/styles/scroll-bar.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//Pinia
import {createPinia, Pinia} from 'pinia'
import router from "@/router/router.ts";

const pinia: Pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
