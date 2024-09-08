import {service} from "@/utils/alova/service.ts";

/**
 * 获取用户设备信息
 */
export const getUserDevice = (userId: string) => {
    return service.Get('/api/oauth/get_device',
        {
            params: {
                user_id: userId,
            },
            meta: {
                ignoreToken: true,
            }
        }
    );
};

/**
 * 生成客户端id
 */
export const generateClientId = () => {
    return service.Get('/api/client/generate_client_id',
        {
            meta: {
                ignoreToken: true,
            },
            cacheFor: {
                mode: "restore",
                expire: 1000 * 60 * 60 * 24 * 7
            }
        }
    );
};
