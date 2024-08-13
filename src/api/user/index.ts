import {service} from "@/utils/alova/service.ts";
import {PhoneLogin} from "@/types/user";

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return service.Get('/api/auth/user/List', {
        meta: {
            ignoreToken: false
        },
        cacheFor: 1000 * 60
    });

};
/**
 * 刷新token
 * @param refreshToken
 */
export const refreshToken = (refreshToken: string) => {
    return service.Get('/api/auth/token/refresh', {
        params: {
            refresh_token: refreshToken
        },
        meta: {
            authRole: 'refreshToken',
            ignoreToken: false
        }
    });
};
/**
 * 发送短信验证码
 * @param phone
 */
export const sendMessage = (phone: string) => {
    return service.Get('/api/sms/test/send', {
        params: {
            phone: phone
        },
        meta: {
            ignoreToken: true
        }
    });
};
/**
 * 手机登录
 * @param param
 */
export const phoneLoginApi = (param: PhoneLogin) => {
    return service.Post('/api/user/phone_login', {
            phone: param.phone,
            captcha: param.captcha,
        },
        {
            meta: {
                ignoreToken: true,
                authRole: 'login'
            }
        }
    );
};
