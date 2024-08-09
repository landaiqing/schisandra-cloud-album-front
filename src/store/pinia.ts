import {createPinia, Pinia} from "pinia";
import {createPersistedStatePlugin} from "pinia-plugin-persistedstate-2";
import stringify from 'json-stringify-safe';
import {App} from "vue";

const pinia: Pinia = createPinia();
const installPersistedStatePlugin = createPersistedStatePlugin({
    serialize: (value) => stringify(value),
    deserialize: (value) => JSON.parse(value),
});
pinia.use((context) => installPersistedStatePlugin(context));

export function setupStore(app: App<Element>) {
    app.use(pinia);
}

export default pinia;
