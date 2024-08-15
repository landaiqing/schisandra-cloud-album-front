import {service} from "@/utils/alova/service.ts";
import {AccountLogin, PhoneLogin, ResetPassword} from "@/types/user";

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return service.Get('/api/auth/user/list', {
        meta: {
            ignoreToken: false
        },
        cacheFor: {
            // 设置缓存模式为持久化模式
            mode: 'restore',
            // 缓存时间
            expire: 1000 * 10,
            tag: 'v1'
        }
    });

};
/**
 * 刷新token
 * @param refreshToken
 */
export const refreshToken = (refreshToken: string) => {
    return service.Post('/api/token/refresh', {
        refresh_token: refreshToken
    }, {
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
/**
 * 账号登录
 * @param param
 */
export const accountLoginApi = (param: AccountLogin) => {
    return service.Post('/api/user/login', {
            account: param.account,
            password: param.password,
        },
        {
            meta: {
                ignoreToken: true,
                authRole: 'login'
            }
        }
    );
};
/**
 * 重置密码
 * @param param
 */
export const resetPasswordApi = (param: ResetPassword) => {
    return service.Post('/api/user/reset_password', {
            phone: param.phone,
            captcha: param.captcha,
            password: param.password,
            repassword: param.repassword
        },
        {
            meta: {
                ignoreToken: true,
            }
        }
    );
};
