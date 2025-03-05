import {service} from "@/utils/alova/service.ts";

/**
 * 获取分享统计信息
 */
export const checkSecuritySettingApi = () => {
    return service.Post('/api/auth/user/check/security/setting', {}, {
        cacheFor: {
            expire: 60 * 60 * 24 * 7,
            mode: "restore",
        },
        meta: {
            ignoreToken: false,
            signature: false,
        },
        name: "check-security-setting",
    });
};
