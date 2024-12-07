import localforage from "localforage";


export const localforageStorageAdapter = {
    async set(key: string, value: any) {
        await localforage.setItem(key, value);
    },
    async get(key: string) {
        const res: any = await localforage.getItem(key);
        return res ? JSON.parse(res) : null;
    },
    async remove(key: any) {
        await localforage.removeItem(key);
    },
    async clear() {
        await localforage.clear();
    }
};
