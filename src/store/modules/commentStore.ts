import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {Comment} from "@/types/comment";
import {cancelCommentLikeApi, commentLikeApi, commentListApi, replyListApi} from "@/api/comment";
import {message} from "ant-design-vue";
import {getSlideCaptchaDataApi} from "@/api/captcha";


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

        /**
         * 获取评论列表
         * @param params
         */
        async function getCommentList(params: any) {
            const data: any = {
                user_id: params.user_id,
                topic_id: params.topic_id,
                page: params.page,
                size: params.size,
                is_hot: params.is_hot,
            };
            commentLoading.value = true;
            commentList.value = {} as Comment;
            // 获取评论列表
            const result: any = await commentListApi(data);
            if (result.code === 200 && result.success && result.data) {
                commentList.value = result.data;
                commentLoading.value = false;
                commentList.value.comments.forEach((item: any) => {
                    commentMap[item.id] = item;
                });
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
                user_id: data.user_id,
            };
            replyLoading.value = true;
            replyList.value = {} as Comment;
            // 获取评论列表
            const result: any = await replyListApi(params);
            if (result.code === 200 && result.success && result.data) {
                replyList.value = result.data;
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
                user_id: data.user_id,
                topic_id: data.topic_id,
            };
            const result: any = await commentLikeApi(params);
            if (result.code !== 200 || !result.success) {
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
                user_id: data.user_id,
                topic_id: data.topic_id,
            };
            const result: any = await cancelCommentLikeApi(params);
            if (result.code !== 200 || !result.success) {
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

        return {
            commentList,
            commentLoading,
            showReplyInput,
            showCommentReply,
            replyList,
            replyLoading,
            slideCaptchaData,
            commentMap,
            getCommentList,
            handleShowReplyInput,
            closeReplyInput,
            handleShowCommentReply,
            getReplyList,
            commentLike,
            cancelCommentLike,
            getSlideCaptchaData,
        };
    },
    {
        // 开启数据持久化
        persist: false,
    }
);
