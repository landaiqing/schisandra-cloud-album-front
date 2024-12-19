import {service} from "@/utils/alova/service.ts";

/**
 * 获取临时二维码
 * @param clientId
 */
export const generateQrCode = (clientId: string) => {
    return service.Get('/api/oauth/wechat/qrcode',
        {
            params: {
                client_id: clientId
            },
            cacheFor: null,
            meta: {
                ignoreToken: true,
            },
        }
    );
};

