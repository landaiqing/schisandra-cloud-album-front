import {service} from "@/utils/alova/service.ts";
import {AccountLogin, PhoneLogin, ResetPassword} from "@/types/user";

/**
 * 刷新token
 */
export const refreshToken = () => {
    return service.Post('/api/auth/token/refresh', {}, {
        meta: {
            authRole: 'refreshToken',
            ignoreToken: false,
            signature: true
        }
    });
};
/**
 * 发送短信验证码
 * @param params
 */
export const sendMessage = (params: any) => {
    return service.Post('/api/sms/test/send', {
            phone: params.phone,
            angle: params.angle,
            key: params.key,
        },
        {
            meta: {
                ignoreToken: true
            }
        }
    );
};
/**
 * 手机登录
 * @param param
 */
export const phoneLoginApi = (param: PhoneLogin) => {
    return service.Post('/api/user/phone/login', {
            phone: param.phone,
            captcha: param.captcha,
            auto_login: param.auto_login
        },
        {
            meta: {
                ignoreToken: true,
                authRole: 'login',
                signature: true
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
            auto_login: param.auto_login,
            angle: param.angle,
            key: param.key,
        },
        {
            meta: {
                ignoreToken: true,
                authRole: 'login',
                signature: true
            }
        }
    );
};
/**
 * 重置密码
 * @param param
 */
export const resetPasswordApi = (param: ResetPassword) => {
    return service.Post('/api/user/reset/password', {
            phone: param.phone,
            captcha: param.captcha,
            password: param.password,
            repassword: param.repassword
        },
        {
            meta: {
                ignoreToken: true,
                signature: true
            }
        }
    );
};


/**
 * 获取用户设备信息
 */
export const getUserDevice = () => {
    return service.Get('/api/user/device',
        {
            params: {},
            meta: {
                ignoreToken: true,
                signature: true
            }
        }
    );
};
