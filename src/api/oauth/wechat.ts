import {service} from "@/utils/alova/service.ts";

/**
 * 获取临时二维码
 * @param clientId
 */
export const generateQrCode = (clientId: string) => {
    return service.Get('/api/oauth/wechat/get_temp_qrcode',
        {
            params: {
                client_id: clientId
            },
            cacheFor: 1000 * 60 * 60 * 24 * 7,
            meta: {
                ignoreToken: true,
            },
        }
    );
};

