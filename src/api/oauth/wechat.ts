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
            meta: {
                ignoreToken: true,
            },
        }
    );
};
/**
 * 关闭websocket
 * @param clientId
 */
export const closeWebsocket = (clientId: string) => {
    return service.Get('/api/ws/delete',
        {
            params: {
                client_id: clientId
            },
            meta: {
                ignoreToken: true,
            },
        }
    );
};
