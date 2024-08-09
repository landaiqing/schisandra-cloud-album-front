import {message} from "ant-design-vue";

export function handleCode(code: number): void {
    switch (code) {
        case 400:
            message
                .open({
                    content: "请求错误(400)",
                    type: "error",
                })
                .then();
            break;
        case 401:
            message
                .open({
                    content: "未授权，请重新登录(401)",
                    type: "error",
                })
                .then();
            break;
        case 403:
            message
                .open({
                    content: "拒绝访问(403)",
                    type: "error",
                })
                .then();
            break;
        case 404:
            message
                .open({
                    content: "请求出错(404)",
                    type: "error",
                })
                .then();
            break;
        case 408:
            message
                .open({
                    content: "请求超时(408)",
                    type: "error",
                })
                .then();
            break;
        case 500:
            message
                .open({
                    content: "服务器错误(500)",
                    type: "error",
                })
                .then();
            break;
        case 501:
            message
                .open({
                    content: "服务未实现(501)",
                    type: "error",
                })
                .then();
            break;
        case 502:
            message
                .open({
                    content: "网络错误(502)",
                    type: "error",
                })
                .then();
            break;
        case 503:
            message
                .open({
                    content: "服务不可用(503)",
                    type: "error",
                })
                .then();
            break;
        case 504:
            message
                .open({
                    content: "网络超时(504)",
                    type: "error",
                })
                .then();
            break;
        case 505:
            message
                .open({
                    content: "HTTP版本不受支持(505)",
                    type: "error",
                })
                .then();
            break;
        default:
            message
                .open({
                    content: `连接出错(${code})!`,
                    type: "error",
                })
                .then();
            break;
    }
}
