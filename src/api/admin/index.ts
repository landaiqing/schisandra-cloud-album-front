import {service} from "@/utils/alova/service.ts";

/**
 *  管理员登录接口
 * @param param
 */
export const adminAccountLoginApi = (param: any) => {
    return service.Post('/api/user/admin/login', {
            account: param.account,
            password: param.password,
            dots: param.dots,
            key: param.key
        },
        {
            meta: {
                ignoreToken: true,
                authRole: 'admin',
                signature: true
            }
        }
    );
};
