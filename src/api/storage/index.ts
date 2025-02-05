import {service} from "@/utils/alova/service.ts";

export const uploadFile = (formData) => {
    return service.Post('/api/auth/storage/uploads', formData, {
        meta: {
            ignoreToken: false,
            signature: false,
        }
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
        }
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
        }
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
        }
    });
};

