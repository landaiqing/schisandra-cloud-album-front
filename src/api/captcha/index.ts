import {service} from "@/utils/alova/service.ts";

/**
 * 获取旋转验证码图片数据
 */
export const getRotatedCaptchaData = () => {
    return service.Get('/api/captcha/rotate/generate', {
        meta: {
            ignoreToken: true
        },
    });
};
/**
 * 获取滑动验证码图片数据
 */
export const getSlideCaptchaDataApi = () => {
    return service.Get('/api/captcha/slide/generate', {
        meta: {
            ignoreToken: false
        },
    });

};
