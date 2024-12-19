import {service} from "@/utils/alova/service.ts";

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
