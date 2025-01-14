import {service} from "@/utils/alova/service.ts";

export const uploadFile = (formData) => {
    return service.Post('/api/auth/file/uploads', formData, {
        meta: {
            ignoreToken: false,
            signature: false,
        }
    });
};
