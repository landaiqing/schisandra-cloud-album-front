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
 */
export const refreshToken = () => {
    return service.Post('/api/token/refresh', {}, {
        meta: {
            authRole: 'refreshToken',
            ignoreToken: false
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
    return service.Post('/api/user/phone_login', {
            phone: param.phone,
            captcha: param.captcha,
            auto_login: param.auto_login
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
            auto_login: param.auto_login,
            angle: param.angle,
            key: param.key,
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
/**
 * 获取用户权限
 * @param user_id
 */
export const getUserPermissions = (user_id: string) => {
    return service.Post('/api/auth/permission/get_user_permissions', {
            user_id: user_id
        },
        {
            meta: {
                ignoreToken: false,
            }
        }
    );
};


/**
 * 获取用户设备信息
 */
export const getUserDevice = () => {
    return service.Get('/api/user/get_device',
        {
            params: {},
            meta: {
                ignoreToken: true,
            }
        }
    );
};
