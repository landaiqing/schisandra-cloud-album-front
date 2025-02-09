import {service} from "@/utils/alova/service.ts";

/**
 * 上传文件
 * @param formData
 */
export const uploadFile = (formData) => {
    return service.Post('/api/auth/storage/uploads', formData, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "upload-file",
    });
};

/**
 * 获取用户人脸样本列表
 * @param type
 */
export const getFaceSamplesList = (type: number) => {
    return service.Post('/api/auth/storage/face/sample/list', {
        type: type,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["modify-face-sample-name", "modify-face-sample-type"],
    });
};
/**
 * 修改人脸样本名称
 * @param id
 * @param face_name
 */
export const modifyFaceSampleName = (id: number, face_name: string) => {
    return service.Post('/api/auth/storage/face/sample/modify/name', {
        id: id,
        face_name: face_name,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "modify-face-sample-name",
    });
};
/**
 * 批量修改人脸样本类型
 * @param ids
 * @param face_type
 */
export const modifyFaceTypeBatch = (ids: number[], face_type: number) => {
    return service.Post('/api/auth/storage/face/sample/modify/type', {
        ids: ids,
        face_type: face_type,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "modify-face-sample-type"
    });
};
/**
 * 创建相册
 * @param name
 */
export const createAlbumApi = (name: string) => {
    return service.Post('/api/auth/storage/album/create', {
        name: name,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "create-album",
    });
};
/**
 * 获取相册列表
 * @param type
 * @param sort
 */
export const albumListApi = (type: string, sort: boolean) => {
    return service.Post('/api/auth/storage/album/list', {
        type: type,
        sort: sort,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["create-album", "rename-album", "delete-album"],
    });
};

/**
 *  重命名相册
 * @param id
 * @param name
 */
export const renameAlbumApi = (id: number, name: string) => {
    return service.Post('/api/auth/storage/album/rename', {
        id: id,
        name: name,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "rename-album",
    });
};
/**
 * 删除相册
 * @param id
 */
export const deleteAlbumApi = (id: number) => {
    return service.Post('/api/auth/storage/album/delete', {
        id: id,
    }, {
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "delete-album",
    });
};
/**
 * 获取所有照片列表
 * @param type
 * @param sort
 * @param provider
 * @param bucket
 */
export const queryAllImagesApi = (type: string, sort: boolean, provider: string, bucket: string) => {
    return service.Post('/api/auth/storage/image/all/list', {
        type: type,
        sort: sort,
        provider: provider,
        bucket: bucket,
    }, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        hitSource: ["upload-file"],
    });
};
