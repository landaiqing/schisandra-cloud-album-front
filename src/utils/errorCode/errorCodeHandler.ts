import {message} from "ant-design-vue";
import i18n from "@/locales";
export function handleErrorCode(code: number): void {
    switch (code) {
        case 400:
            message
                .open({
                    content: i18n.global.t("error.400"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 401:
            message
                .open({
                    content: i18n.global.t("error.401"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 403:
            message
                .open({
                    content: i18n.global.t("error.403"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 404:
            message
                .open({
                    content: i18n.global.t("error.404"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 408:
            message
                .open({
                    content: i18n.global.t("error.408"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 500:
            message
                .open({
                    content: i18n.global.t("error.500"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 501:
            message
                .open({
                    content: i18n.global.t("error.501"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 502:
            message
                .open({
                    content: i18n.global.t("error.502"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 503:
            message
                .open({
                    content: i18n.global.t("error.503"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 504:
            message
                .open({
                    content: i18n.global.t("error.504"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        case 505:
            message
                .open({
                    content: i18n.global.t("error.505"),
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
        default:
            message
                .open({
                    content: i18n.global.t("error.other") + `(${code})`,
                    duration: 5,
                    type: "error",
                })
                .then();
            break;
    }
}
