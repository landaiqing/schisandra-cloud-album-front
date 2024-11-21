import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {Comment} from "@/types/comment";
import {cancelCommentLikeApi, commentLikeApi, commentListApi, replyListApi} from "@/api/comment";
import {message} from "ant-design-vue";
import {getSlideCaptchaDataApi} from "@/api/captcha";
import QQ_EMOJI from "@/constant/qq_emoji.ts";
import {initNSFWJs, predictNSFW} from "@/utils/nsfw/nsfw.ts";
import {NSFWJS} from "nsfwjs";
import i18n from "@/locales";

export const useCommentStore = defineStore(
    'comment',
    () => {
        const commentList = ref<Comment>({} as Comment);
        const commentLoading = ref<boolean>(true);
        const replyLoading = ref<boolean>(true);
        const showReplyInput = ref<number | null>(null);
        const showCommentReply = ref<number | null>(null);
        const replyList = ref<Comment>({} as Comment);
        const commentMap = reactive<any>({});
        const slideCaptchaData = reactive({
            key: "",
            image: "",
            thumb: "",
            thumbWidth: 0,
            thumbHeight: 0,
            thumbX: 0,
            thumbY: 0
        });
        const fileList = ref<any[]>([]);
        const imageList = ref<any[]>([]);
        const uploadLoading = ref<boolean>(false);
        const emojiList = ref<any[]>(QQ_EMOJI);
        const commentId = ref<number | null>(null);
        const showMessageReport = ref<boolean>(false);
        const reportType = ref<number>(0);
        const reportContent = ref<string>("");

        /**
         * 获取评论列表
         * @param params
         */
        async function getCommentList(params: any) {
            const data: any = {
                topic_id: params.topic_id,
                page: params.page,
                size: params.size,
                is_hot: params.is_hot,
            };
            commentLoading.value = true;
            commentList.value = {} as Comment;
            // 获取评论列表
            const result: any = await commentListApi(data);
            if (result.code === 200 && result.data) {
                commentList.value = result.data;
                commentLoading.value = false;
                commentList.value.comments.forEach((item: any) => {
                    commentMap[item.id] = item;
                });
            } else {
                commentLoading.value = false;
            }

        }

        /**
         *  显示回复输入框
         */
        const handleShowReplyInput = (index: any) => {
            showReplyInput.value = showReplyInput.value === index ? null : index;
        };
        /**
         *  关闭回复输入框
         */
        const closeReplyInput = () => {
            showReplyInput.value = null;
        };
        /**
         *  是否显示回复
         */
        const handleShowCommentReply = (index: any) => {
            showCommentReply.value = showCommentReply.value === index ? null : index;
        };

        /**
         * 获取回复列表
         * @param data
         */
        async function getReplyList(data: any) {
            const params: any = {
                topic_id: data.topic_id,
                page: data.page,
                size: data.size,
                comment_id: data.comment_id,
            };
            replyLoading.value = true;
            replyList.value = {} as Comment;
            // 获取评论列表
            const result: any = await replyListApi(params);
            if (result.code === 200 && result.data) {
                replyList.value = result.data;
                replyLoading.value = false;
            } else {
                replyLoading.value = false;
            }
        }

        /**
         *  评论点赞
         * @param data
         */
        async function commentLike(data: any): Promise<boolean> {
            const params: any = {
                comment_id: data.comment_id,
                topic_id: data.topic_id,
            };
            const result: any = await commentLikeApi(params);
            if (result.code !== 200) {
                message.error(result.message);
                return false;
            }
            return true;
        }

        /**
         *  取消评论点赞
         * @param data
         */
        async function cancelCommentLike(data: any): Promise<boolean> {
            const params: any = {
                comment_id: data.comment_id,
                topic_id: data.topic_id,
            };
            const result: any = await cancelCommentLikeApi(params);
            if (result.code !== 200) {
                message.error(result.message);
                return false;
            }
            return true;
        }

        /**
         * 获取滑动验证码数据
         */
        async function getSlideCaptchaData(): Promise<boolean> {
            const res: any = await getSlideCaptchaDataApi();
            if (res.code == 200 && res.data) {
                const {key, image, thumb, thumb_width, thumb_height, thumb_x, thumb_y} = res.data;
                slideCaptchaData.key = key;
                slideCaptchaData.image = image;
                slideCaptchaData.thumb = thumb;
                slideCaptchaData.thumbWidth = thumb_width;
                slideCaptchaData.thumbHeight = thumb_height;
                slideCaptchaData.thumbX = thumb_x;
                slideCaptchaData.thumbY = thumb_y;
                return true;
            }
            return false;
        }

        /**
         *  清空文件列表
         */
        async function clearFileList() {
            fileList.value = [];
            imageList.value = [];
        }


        /**
         * 上传文件前置
         * @param file
         */
        async function beforeUpload(file: any) {
            uploadLoading.value = true;
            // 压缩图片配置
            // const options = {
            //     maxSizeMB: 0.4,
            //     maxWidthOrHeight: 750,
            //     maxIteration: 2
            // };
            if (!window.FileReader) return false; // 判断是否支持FileReader
            // const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.readAsDataURL(file); // 文件转换
            reader.onloadend = async function () {
                if (fileList.value.length < 3) {
                    const img: HTMLImageElement = document.createElement('img');
                    img.src = reader.result as string;
                    img.onload = async () => {
                        // 图片 NSFW 检测
                        const nsfw: NSFWJS = await initNSFWJs();
                        const isNSFW: boolean = await predictNSFW(nsfw, img);
                        if (isNSFW) {
                            message.error(i18n.global.t('comment.illegalImage'));
                            fileList.value.pop();
                            uploadLoading.value = false;
                            return false;
                        }
                        fileList.value.push(img.src);
                        uploadLoading.value = false;
                    };
                } else {
                    return false;
                }
            };

            return true;
        }

        /**
         *  自定义上传图片请求
         */
        async function customUploadRequest() {
            imageList.value = fileList.value;
        }

        /**
         *  移除图片
         * @param index
         */
        async function removeBase64Image(index: number) {
            fileList.value.splice(index, 1);
            imageList.value.splice(index, 1);
        }

        /**
         *  格式化时间
         * @param dateString
         */
        function formatTimeAgo(dateString: string) {
            const now: any = new Date();
            const date: any = new Date(dateString);
            const seconds = Math.floor((now - date) / 1000);

            const intervals = [
                {label: '年', seconds: 31536000},
                {label: '个月', seconds: 2592000},
                {label: '天', seconds: 86400},
                {label: '小时', seconds: 3600},
                {label: '分钟', seconds: 60}
            ];

            for (const interval of intervals) {
                const count = Math.floor(seconds / interval.seconds);
                if (count > 0) {
                    return `${count} ${interval.label}前`;
                }
            }

            return `${seconds} 秒前`;
        }

        /**
         *  打开举报弹窗
         * @param id
         */
        function openReportMessage(id: number) {
            commentId.value = id;
            showMessageReport.value = true;
        }

        /**
         *  关闭举报弹窗
         */
        function closeReportMessage() {
            commentId.value = null;
            showMessageReport.value = false;
            reportType.value = 0;
            reportContent.value = "";
        }

        return {
            commentList,
            commentLoading,
            showReplyInput,
            showCommentReply,
            replyList,
            replyLoading,
            slideCaptchaData,
            commentMap,
            fileList,
            imageList,
            uploadLoading,
            emojiList,
            commentId,
            showMessageReport,
            reportType,
            reportContent,
            getCommentList,
            handleShowReplyInput,
            closeReplyInput,
            handleShowCommentReply,
            getReplyList,
            commentLike,
            cancelCommentLike,
            getSlideCaptchaData,
            beforeUpload,
            customUploadRequest,
            removeBase64Image,
            clearFileList,
            formatTimeAgo,
            openReportMessage,
            closeReportMessage
        };
    },
    {
        // 开启数据持久化
        persist: {
            key: 'comment',
            storage: localStorage,
            pick: ["emojiList", "commentList", "replyList", "commentMap"],
        }
    }
);
