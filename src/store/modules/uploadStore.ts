interface UploadPredictResult {
    isAnime: boolean;
    hasFace: boolean;
    objectArray: string[] | unknown[];
    landscape: 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | 'none' | undefined;
}


export const useUploadStore = defineStore(
    'upload',
    () => {
        const openUploadDrawer = ref<boolean>(false);

        const predictResult = reactive<UploadPredictResult>({
            isAnime: false,
            hasFace: false,
            objectArray: [],
            landscape: undefined as 'building' | 'forest' | 'glacier' | 'mountain' | 'sea' | 'street' | 'none' | undefined,
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
            predictResult.landscape = undefined;
        }

        return {
            openUploadDrawer,
            predictResult,
            openUploadDrawerFn,
            clearPredictResult
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: false,
            storage: localStorage,
            key: 'upload',
            includePaths: []
        }
    }
);
