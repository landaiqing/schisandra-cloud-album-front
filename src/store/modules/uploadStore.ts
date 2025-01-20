import localforage from 'localforage';

interface UploadPredictResult {
    isAnime: boolean;
    hasFace: boolean;
    objectArray: string[] | unknown[];
    landscape: 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | 'none';
    isScreenshot: boolean;
    topCategory: string | undefined;
}


export const useUploadStore = defineStore(
    'upload',
    () => {
        const openUploadDrawer = ref<boolean>(false);

        const exifData = ref<any>();
        const predictResult = reactive<UploadPredictResult>({
            isAnime: false,
            hasFace: false,
            objectArray: [],
            landscape: 'none',
            isScreenshot: false,
            topCategory: ''
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
            predictResult.hasFace = false;
            predictResult.objectArray = [];
            predictResult.landscape = 'none';
            predictResult.isScreenshot = false;
            predictResult.topCategory = '';
        }


        return {
            openUploadDrawer,
            predictResult,
            exifData,
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
