import {service} from "@/utils/alova/service.ts";

/**
 * 获取验证码图片数据
 */
export const getRotatedCaptchaData = () => {
    return service.Get('/api/captcha/rotate/get', {
        meta: {
            ignoreToken: true
        },
    });

};
/**
 * 验证验证码
 * @param angle
 * @param key
 */
export const checkRotatedCaptcha = (angle: any, key: any) => {
    return service.Post('/api/captcha/rotate/check', {
            angle: angle,
            key: key,
        },
        {
            meta: {
                ignoreToken: true
            },
        }
    );

};
