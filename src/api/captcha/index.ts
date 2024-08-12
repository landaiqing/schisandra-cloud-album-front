import {service} from "@/utils/alova/service.ts";

export const getRotatedCaptchaData = () => {
    return service.Get('/api/captcha/rotate/get', {
        meta: {
            ignoreToken: true
        },
    });

};
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
