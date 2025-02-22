import {ImageList} from "@/types/image";

export const useImageStore = defineStore(
    'image',
    () => {
        const selected = ref<number[]>([]);
        const tabActiveKey = ref<string>("-1");
        const tabMap = reactive({
            "-1": "全部相册",
            "0": "我的相册",
            "1": "我的分享",
            "2": "我的收藏",
        });
        const homeTabActiveKey = ref<string>("all");
        const homeTabMap = reactive({
            "all": "全部",
            "video": "视频",
            "gif": "动图",
            "screenshot": "截图",
        });

        /**
         * 统计图片总数
         * @param imageList 图片列表数据
         * @returns 图片总数
         */
        function countTotalImages(imageList: ImageList): number {
            if (!imageList) {
                return 0;
            }
            return imageList.reduce((total, record) => total + record.list.length, 0);
        }

        return {
            selected,
            tabActiveKey,
            tabMap,
            homeTabMap,
            homeTabActiveKey,
            countTotalImages
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'image',
            includePaths: ["tabActiveKey", "tabMap", "homeTabActiveKey", "homeTabMap"],
        }
    }
);
