import {handleLocalforage} from "@/utils/localforage";

export const localforageStorageAdapter = {
    set(key: string, value: any) {
        handleLocalforage.setItem(key, value);
    },
    get(key: string) {
        const data: string = handleLocalforage.getItem(key);
        return data ? JSON.parse(data) : data;
    },
    remove(key: any) {
        handleLocalforage.removeItem(key);
    },
    clear() {
        handleLocalforage.clear().then();
    }
};
