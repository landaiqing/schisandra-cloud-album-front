import {createApp} from 'vue';
import App from './App.vue';
import '@/assets/styles/scroll-bar.scss';
import '@/assets/styles/global.scss';
import i18n from "@/locales/index.ts";
import router from "@/router/router.ts";
import "go-captcha-vue/dist/style.css";
import GoCaptcha from "go-captcha-vue";
import {createPinia, Pinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(GoCaptcha);
app.mount('#app');
