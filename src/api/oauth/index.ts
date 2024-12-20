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


/**
 * Get Github OAuth URL
 */
export const getGithubUrl = (state: string) => {
    return service.Get('/api/oauth/github/url',
        {
            params: {
                state: state
            },
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


export const getQQUrl = (state: string) => {
    return service.Get('/api/oauth/qq/url',
        {
            params: {
                state: state
            },
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
