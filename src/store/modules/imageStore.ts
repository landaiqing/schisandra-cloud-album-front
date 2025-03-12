import {ImageList} from "@/types/image";
import localForage from "localforage";
import {albumListApi, getFaceSamplesList} from "@/api/storage";

export const useImageStore = defineStore(
    'image',
    () => {
        // 选择的图片列表
        const selected = ref<number[]>([]);
        const homeTabActiveKey = ref<string>("all");
        const homeTabMap = reactive({
            "all": "全部",
            "video": "视频",
            "gif": "动图",
            "screenshot": "截图",
        });
        // 清爽模式切换
        const switchValue = ref<boolean>(false);


        // 图片列表布局相关
        const JustifiedLayoutOptions = reactive({
            targetRowHeight: 200 // 高度
        });
        // 图片列表数据
        const imageList = ref<any[]>([]);
        const imageListLoading = ref<boolean>(false);

        // 相册相关
        const albumList = ref<any[]>([]);
        const albumListLoading = ref<boolean>(false);
        const sortSelectedKey = ref<boolean>(true);
        const tabActiveKey = ref<string>("-1");
        const tabMap = reactive({
            "-1": "全部相册",
            "0": "我的相册",
            "1": "我的分享",
            "2": "我的收藏",
        });
        const albumIdList = ref<number[]>([]);

        // 相册分享弹窗相关
        const openAlbumShareDialog = ref<boolean>(false);
        const albumShareCoverImage = ref<string>("");
        const albumShareId = ref<number>(0);

        // 人脸相册
        const faceSelectedKey = ref<string>("0");
        const faceSelected = ref<number[]>([]);
        const faceList = ref<any[]>([]);
        const faceListLoading = ref<boolean>(false);


        // 图片编辑
        const imageEditVisible = ref<boolean>(false);


        /**
         * 获取人脸列表
         */
        async function getFaceList() {
            faceListLoading.value = true;
            faceList.value = [];
            const res: any = await getFaceSamplesList(parseInt(faceSelectedKey.value));
            if (res && res.code === 200 && res.data.faces) {
                faceList.value = res.data.faces.map(face => ({
                    ...face,
                    showButton: false,
                    showInput: false,
                }));
            }
            faceListLoading.value = false;
        }

        /**
         * 获取相册列表
         */
        async function getAlbumList() {
            albumList.value = [];
            albumListLoading.value = true;
            const res: any = await albumListApi(parseInt(tabActiveKey.value), sortSelectedKey.value);
            if (res && res.code === 200) {
                albumList.value = res.data.albums;
            }
            albumListLoading.value = false;
        }


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

        function openAlbumShareDialogHandler(value: boolean, coverImage: string, albumId: number) {
            openAlbumShareDialog.value = value;
            albumShareCoverImage.value = coverImage;
            albumShareId.value = albumId;
        }

        return {
            selected,
            tabActiveKey,
            tabMap,
            homeTabMap,
            switchValue,
            homeTabActiveKey,
            albumShareCoverImage,
            albumShareId,
            imageList,
            imageListLoading,
            albumListLoading,
            albumList,
            sortSelectedKey,
            faceSelectedKey,
            faceSelected,
            faceList,
            faceListLoading,
            openAlbumShareDialog,
            JustifiedLayoutOptions,
            albumIdList,
            imageEditVisible,
            countTotalImages,
            openAlbumShareDialogHandler,
            getAlbumList,
            getFaceList,
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localForage,
            key: 'STORE-IMAGE',
            includePaths: [
                "tabActiveKey",
                "tabMap",
                "homeTabActiveKey",
                "homeTabMap",
                "switchValue",
                "faceSelectedKey",
                "albumList",
                "albumIdList"
            ],
        }
    }
);
