import {service} from "@/utils/alova/service.ts";
import {uploadImageRequest} from "@/types/upscale";

export const uploadImage = (data: uploadImageRequest) => {
    return service.Post('/api/auth/upscale/upload', {
        image: data.image,
        access_token: data.access_token,
        user_id: data.user_id,
    }, {
        meta: {
            ignoreToken: false,
            signature: true
        }
    });
};
