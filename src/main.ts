import {createApp} from 'vue';
import App from './App.vue';
import '@/assets/styles/scroll-bar.scss';
import '@/assets/styles/global.scss';
import i18n from "@/locales/index.ts";
import {setupStore} from "@/store/pinia.ts";
import router from "@/router/router.ts";

const app = createApp(App);
setupStore(app);
app.use(router);
app.use(i18n);
app.mount('#app');
