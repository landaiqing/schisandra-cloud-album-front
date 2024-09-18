import {service} from "@/utils/alova/service.ts";

/**
 * 上传图片转base64
 */
export const uploadToBase64 = (images: any[]) => {
    return service.Post('/api/auth/comment/upload_to_base64',
        {
            images,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            meta: {
                ignoreToken: false,
            }
        }
    );
};
