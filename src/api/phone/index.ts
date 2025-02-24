import {service} from "@/utils/alova/service.ts";

export const uploadImage = (data: any) => {
    return service.Post('/api/auth/phone/upload', {
        image: data.image,
        access_token: data.access_token,
        user_id: data.user_id,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        }
    });
};
/**
 * 上传分享图片
 * @param data
 */
export const sharePhoneUploadApi = (data: any) => {
    return service.Post('/api/auth/phone/share/upload', {
        ...data,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        }
    });
};
