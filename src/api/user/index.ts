import {service} from "@/utils/alova/service.ts";


export const getUserInfo = () => {
    return service.Get('/api/auth/user/List', {
        meta: {
            ignoreToken: true
        },
    });

};
