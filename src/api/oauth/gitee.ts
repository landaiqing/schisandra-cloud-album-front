import {service} from "@/utils/alova/service.ts";

/**
 * 获取Gitee登录链接
 */
export const getGiteeUrl = () => {
    return service.Get('/api/oauth/gitee/url',
        {
            meta: {
                ignoreToken: true,
            },
            cacheFor: {
                mode: "restore",
                expire: 1000 * 60 * 60 * 24
            }
        }
    );
};
