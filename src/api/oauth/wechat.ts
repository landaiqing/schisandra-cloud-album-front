import {service} from "@/utils/alova/service.ts";

/**
 * 生成客户端id
 */
export const generateClientId = () => {
    return service.Get('/api/oauth/wechat/generate_client_id',
        {
            meta: {
                ignoreToken: true,
            },
            cacheFor: {
                mode: "restore",
                expire: 1000 * 60 * 60 * 24 * 30 // 30天
            }
        }
    );
};
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
