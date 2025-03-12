import {service} from "@/utils/alova/service.ts";

/**
 * 上传分享图片
 * @param formData
 */
export const shareImageUploadApi = (formData: any) => {
    return service.Post('/api/auth/share/upload', {...formData}, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: 'upload-share-image',
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
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
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
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-share-image", "delete-share-record"]
    });
};
/**
 * 查询分享信息
 * @param invite_code
 * @param access_password
 */
export const queryShareInfoApi = (invite_code: string, access_password: string) => {
    return service.Post('/api/auth/share/info', {
        invite_code: invite_code,
        access_password: access_password,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
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
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-share-image", "delete-share-record"]
    });
};
/**
 * 删除分享记录
 * @param id
 * @param invite_code
 * @param album_id
 */
export const deleteShareRecordApi = (id: number, invite_code: string, album_id: number) => {
    return service.Post('/api/auth/share/record/delete', {
        id: id,
        invite_code: invite_code,
        album_id: album_id,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: 'delete-share-record',
    });
};
