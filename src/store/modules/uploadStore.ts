import localforage from 'localforage';

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
        });

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
        }


        return {
            openUploadDrawer,
            predictResult,
            openUploadDrawerFn,
            clearPredictResult,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: false,
            storage: localforage,
            key: 'upload',
            includePaths: []
        }
    }
);
