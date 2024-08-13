import {service} from "@/utils/alova/service.ts";


export const getUserInfo = () => {
    return service.Get('/api/auth/user/List', {
        meta: {
            ignoreToken: false
        },
    });

};

export const refreshToken = (refreshToken: string) => {
    return service.Get('/api/auth/token/refresh', {
        params: {
            refresh_token: refreshToken
        },
        meta: {
            authRole: 'refreshToken'
        }
    });
};
