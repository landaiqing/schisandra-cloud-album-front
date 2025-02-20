import {service} from "@/utils/alova/service.ts";

/**
 * 上传分享图片
 * @param formData
 */
export const shareImageUploadApi = (formData) => {
    return service.Post('/api/auth/share/upload', {...formData}, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
    });
};
/**
 * 查询分享图片列表
 * @param share_code
 * @param access_password
 */
export const queryShareImageApi = (share_code: string, access_password: string) => {
    return service.Post('/api/auth/share/image/list', {
        share_code: share_code,
        access_password: access_password,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
    });
};
/**
 * 查询分享记录列表
 */
export const queryShareRecordListApi = (dataRequest: string[]) => {
    return service.Post('/api/auth/share/record/list', {
        date_range: dataRequest,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
    });
};
