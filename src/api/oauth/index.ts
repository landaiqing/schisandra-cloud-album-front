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
