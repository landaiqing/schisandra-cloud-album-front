// import localforage from 'localforage';

interface UploadPredictResult {
    isAnime: boolean;
    tagName: string | null;
    landscape: 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;
    isScreenshot: boolean;
    topCategory: string | undefined;
    width: number | null;
    height: number | null;
    latitude: number | null;
    longitude: number | null;
    thumb_w: number | null;
    thumb_h: number | null;
    thumb_size: number | null;
}


export const useUploadStore = defineStore(
    'upload',
    () => {
        const openUploadDrawer = ref<boolean>(false);

        const predictResult = reactive<UploadPredictResult>({
            isAnime: false,
            tagName: null,
            landscape: null,
            isScreenshot: false,
            topCategory: '',
            width: null,
            height: null,
            latitude: null,
            longitude: null,
            thumb_w: null,
            thumb_h: null,
            thumb_size: null,
        });

        const storageSelected = ref<any[]>([]);

        /**
         * 打开上传抽屉
         */
        async function openUploadDrawerFn() {
            openUploadDrawer.value = true;
        }

        /**
         *  清除预测结果
         */
        function clearPredictResult() {
            predictResult.isAnime = false;
            predictResult.tagName = null;
            predictResult.landscape = null;
            predictResult.isScreenshot = false;
            predictResult.topCategory = '';
            predictResult.width = null;
            predictResult.height = null;
            predictResult.latitude = null;
            predictResult.longitude = null;
            predictResult.thumb_w = null;
            predictResult.thumb_h = null;
            predictResult.thumb_size = null;
        }


        return {
            openUploadDrawer,
            predictResult,
            storageSelected,
            openUploadDrawerFn,
            clearPredictResult,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'upload',
            includePaths: ["storageSelected"]
        }
    }
);
