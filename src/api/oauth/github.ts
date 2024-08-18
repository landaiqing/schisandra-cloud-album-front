import {service} from "@/utils/alova/service.ts";

/**
 * Get Github OAuth URL
 */
export const getGithubUrl = () => {
    return service.Get('/api/oauth/github/get_url',
        {
            meta: {
                ignoreToken: true,
            },
            cacheFor: {
                mode: "restore",
                expire: 1000 * 60 * 60 * 24 * 30 // 30 days
            }
        }
    );
};
