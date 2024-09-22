import {service} from "@/utils/alova/service.ts";

/**
 * @description 评论提交
 * @param params
 */
export const commentSubmitApi = (params: any) => {
    return service.Post('/api/auth/comment/submit', {
            user_id: params.user_id,
            content: params.content,
            images: params.images,
            topic_id: params.topic_id,
            author: params.author,
        },
        {
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
    return service.Post('/api/auth/reply/submit', {
            user_id: params.user_id,
            content: params.content,
            images: params.images,
            topic_id: params.topic_id,
            reply_id: params.reply_id,
            reply_user: params.reply_user,
            author: params.author,
        },
        {
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
        },
        {
            cacheFor: 1000 * 60 * 60 * 24 * 7, // 7天缓存
            meta: {
                ignoreToken: false,
            },
        }
    );
};
