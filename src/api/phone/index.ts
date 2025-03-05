import {service} from "@/utils/alova/service_app.ts";

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

/**
 * 上传文件
 * @param formData
 * @param headers
 */
export const uploadFile = (formData: any, headers: any) => {
    return service.Post('/api/auth/storage/uploads', formData, {
        headers: headers,
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "upload-file",
    });
};

export const albumListApi = (type: number, sort: boolean, headers: any) => {
    return service.Post('/api/auth/storage/album/list', {
        type: type,
        sort: sort,
    }, {
        headers: headers,
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["create-album", "rename-album", "delete-album", "album-share"],
    });
};
