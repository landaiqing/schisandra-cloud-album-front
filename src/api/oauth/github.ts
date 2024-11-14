import {service} from "@/utils/alova/service.ts";

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
                expire: 1000 * 60 * 60 * 24 * 7
            }
        }
    );
};
