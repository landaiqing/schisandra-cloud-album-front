export interface Comment {
    comments: CommentContent[];
    current: number;
    total: number;
    size: number;
}

interface CommentContent {
    author: number;
    browser: string;
    content: string;
    created_time: string;
    dislikes: number;
    id: number;
    likes: number;
    location: string;
    operating_system: string;
    reply_count: number;
    reply_username: string;
    reply_id: string;
    reply_user: string;
    topic_id: string;
    user_id: string;
    avatar: string;
    nickname: string;
    level?: number;
    images: string[];
}

export interface ReplyCommentParams {
    user_id: string,
    topic_id: string,
    content: string,
    images: string[],
    author: string,
    reply_id: number,
    reply_user: string,
    reply_to: number,
}
