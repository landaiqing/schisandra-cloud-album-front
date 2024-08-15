import {service} from "@/utils/alova/service.ts";

/**
 * 生成客户端id
 */
export const generateClientId = () => {
    return service.Get('/api/oauth/generate_client_id',
        {
            meta: {
                ignoreToken: true,
            }
        }
    );
};
/**
 * 获取临时二维码
 * @param clientId
 */
export const generateQrCode = (clientId: string) => {
    return service.Get('/api/oauth/get_temp_qrcode',
        {
            params: {
                client_id: clientId
            },
            meta: {
                ignoreToken: true,
            },
            cacheFor: {
                // 设置缓存模式为持久化模式
                mode: 'restore',
                // 缓存时间
                expire: 30 * 24 * 60 * 60 * 1000,
                tag: 'v1'
            }
        }
    );
};
