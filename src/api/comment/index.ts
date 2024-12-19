import {service} from "@/utils/alova/service.ts";

/**
 * @description 评论提交
 * @param params
 */
export const commentSubmitApi = (params: any) => {
    return service.Post('/api/auth/comment/submit', {
            content: params.content,
            images: params.images,
            topic_id: params.topic_id,
            author: params.author,
            point: params.point,
            key: params.key,
        },
        {
            name: 'comment-submit',
            meta: {
                ignoreToken: false,
            },
        }
    );
};
/**
 * @description 回复提交
 * @param params
 */
export const replySubmitApi = (params: any) => {
    return service.Post('/api/auth/comment/reply/submit', {
            content: params.content,
            images: params.images,
            topic_id: params.topic_id,
            reply_id: params.reply_id,
            reply_user: params.reply_user,
            author: params.author,
            point: params.point,
            key: params.key,
        },
        {
            name: 'reply-submit',
            meta: {
                ignoreToken: false,
            },
        }
    );
};

/**
 * @description 评论列表
 * @param params
 */
export const commentListApi = (params: any) => {
    return service.Post('/api/auth/comment/list', {
            page: params.page,
            size: params.size,
            topic_id: params.topic_id,
            is_hot: params.is_hot,
        },
        {
            cacheFor: {
                expire: 60 * 60 * 24,
                mode: "restore",
            }, // 7天缓存
            hitSource: "comment-submit",
            meta: {
                ignoreToken: false,
            },
        }
    );
};
/**
 * @description 评论列表
 * @param params
 */
export const replyListApi = (params: any) => {
    return service.Post('/api/auth/comment/reply/list', {
            page: params.page,
            size: params.size,
            comment_id: params.comment_id,
            topic_id: params.topic_id,
        },
        {
            cacheFor: {
                expire: 60 * 60 * 24,
                mode: "restore",
            }, // 7天缓存
            hitSource: ["reply-submit", "reply-reply-submit"],
            meta: {
                ignoreToken: false,
            },
        }
    );
};

/**
 * @description 回复的回复提交
 * @param params
 */
export const replyReplySubmitApi = (params: any) => {
    return service.Post('/api/auth/comment/reply/reply/submit', {
            content: params.content,
            images: params.images,
            topic_id: params.topic_id,
            reply_to_user: params.reply_to_user,
            reply_to: params.reply_to,
            reply_id: params.reply_id,
            reply_user: params.reply_user,
            author: params.author,
            point: params.point,
            key: params.key,
        },
        {
            name: 'reply-reply-submit',
            meta: {
                ignoreToken: false,
            },
        }
    );
};
/**
 * @description 评论点赞
 * @param params
 */
export const commentLikeApi = (params: any) => {
    return service.Post('/api/auth/comment/like', {
            comment_id: params.comment_id,
            topic_id: params.topic_id,
        },
        {
            meta: {
                ignoreToken: false,
            },
        }
    );
};

/**
 * @description 评论取消点赞
 * @param params
 */
export const cancelCommentLikeApi = (params: any) => {
    return service.Post('/api/auth/comment/dislike', {

            comment_id: params.comment_id,
            topic_id: params.topic_id,
        },
        {
            meta: {
                ignoreToken: false,
            },
        }
    );
};
