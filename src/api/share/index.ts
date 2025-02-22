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
 * @param invite_code
 * @param access_password
 */
export const queryShareImageApi = (invite_code: string, access_password: string) => {
    return service.Post('/api/auth/share/image/list', {
        invite_code: invite_code,
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
/**
 * 查询分享信息
 * @param invite_code
 */
export const queryShareInfoApi = (invite_code: string) => {
    return service.Post('/api/auth/share/info', {
        invite_code: invite_code,
    }, {
        cacheFor: {
            expire: 60, //60 * 60 * 24 * 7
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
    });
};
/**
 * 查询分享概览
 */
export const queryShareOverviewApi = () => {
    return service.Post('/api/auth/share/overview', {}, {
        cacheFor: {
            expire: 60, //60 * 60 * 24 * 7
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
    });
};
