import {createPinia, Pinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {App} from "vue";

const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

export function setupStore(app: App<Element>) {
    app.use(pinia);
}

export default pinia;
