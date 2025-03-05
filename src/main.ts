import {createApp} from 'vue';
import App from './App.vue';
import "@/assets/styles/normalize.css";
import i18n from "@/locales/index.ts";
import router from "@/router/router.ts";
import "go-captcha-vue/dist/style.css";
import GoCaptcha from "go-captcha-vue";
import {createPinia, Pinia} from "pinia";
import {createPersistedStatePlugin} from 'pinia-plugin-persistedstate-2';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import {registerDirectives} from "@/directives";

import VueCalendarMap from '@fcli/vue-calendar-map';

const pinia: Pinia = createPinia();
const installPersistedStatePlugin = createPersistedStatePlugin();
pinia.use((context) => installPersistedStatePlugin(context));
const app = createApp(App);
registerDirectives(app);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(GoCaptcha);
app.use(VueDOMPurifyHTML);
app.use(VueCalendarMap);
app.mount('#app');
