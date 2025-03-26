import {service} from "@/utils/alova/service.ts";

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 */
export const sendEmailCaptchaApi = (email: string) => {
    return service.Post('/api/user/email/captcha/send', {
            email: email,
        },
        {
            meta: {
                ignoreToken: false,
                signature: true
            }
        }
    );
};

/**
 * 绑定邮箱
 * @param email 邮箱地址
 * @param captcha 验证码
 */
export const bindEmailApi = (email: string, captcha: string) => {
    return service.Post('/api/user/email/bind', {
            email: email,
            captcha: captcha,
        },
        {
            meta: {
                ignoreToken: false,
                signature: true
            }
        }
    );
};

/**
 * 解绑邮箱
 */
export const unbindEmailApi = () => {
    return service.Post('/api/user/email/unbind', {},
        {
            meta: {
                ignoreToken: false,
                signature: true
            }
        }
    );
};

/**
 * 修改邮箱
 * @param email 新邮箱地址
 * @param captcha 验证码
 */
export const updateEmailApi = (email: string, captcha: string) => {
    return service.Post('/api/user/email/update', {
            email: email,
            captcha: captcha,
        },
        {
            meta: {
                ignoreToken: false,
                signature: true
            }
        }
    );
};