import localforage from 'localforage';

interface UploadPredictResult {
    isAnime: boolean;
    objectArray: string[] | unknown[];
    landscape: 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | null;
    isScreenshot: boolean;
    topCategory: string | undefined;
    exif: object | "";
    width: number | null;
    height: number | null;
}


export const useUploadStore = defineStore(
    'upload',
    () => {
        const openUploadDrawer = ref<boolean>(false);

        const predictResult = reactive<UploadPredictResult>({
            isAnime: false,
            objectArray: [],
            landscape: null,
            isScreenshot: false,
            topCategory: '',
            exif: "",
            width: null,
            height: null,
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
            predictResult.objectArray = [];
            predictResult.landscape = null;
            predictResult.isScreenshot = false;
            predictResult.topCategory = '';
            predictResult.exif = "";
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
