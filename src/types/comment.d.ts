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
    id: number;
    likes: number;
    location: string;
    operating_system: string;
    reply_count: number;
    reply_nickname: string;
    reply_id: string;
    reply_user: string;
    topic_id: string;
    user_id: string;
    avatar: string;
    nickname: string;
    level?: number;
    images: string[];
    is_liked: boolean;
}

export interface ReplyCommentParams {
    topic_id: string,
    content: string,
    images: string[],
    author: string,
    reply_id: number,
    reply_user: string,
    reply_to: number,
    point: [number, number]
    key: string
}
