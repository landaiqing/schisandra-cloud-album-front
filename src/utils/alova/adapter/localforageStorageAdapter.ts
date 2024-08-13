import localforage from "localforage";


export const localforageStorageAdapter = {
    set(key: string, value: any) {
        localforage.setItem(key, value).then();
    },
    get(key: string) {
        let value: any;
        localforage.getItem(key).then((res: any) => {
            if (res === null || res === undefined || res === "") {
                value = "";
            } else {
                value = res;
            }
        });
        return value ? JSON.parse(value) : value;
    },
    remove(key: any) {
        localforage.removeItem(key).then();
    },
    clear() {
        localforage.clear().then();
    }
};
