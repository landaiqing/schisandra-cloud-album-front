import {service} from "@/utils/alova/service.ts";

/**
 * 生成客户端id
 */
export const generateClientId = () => {
    return service.Get('/api/client/generate',
        {
            meta: {
                ignoreToken: true,
                signature: true
            },
            cacheFor: null,
        }
    );
};
