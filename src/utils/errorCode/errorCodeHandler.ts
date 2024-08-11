import {message} from "ant-design-vue";
import i18n from "@/locales";
export function handleCode(code: number): void {
    switch (code) {
        case 400:
            message
                .open({
                    content: i18n.global.t("error.400"),
                    type: "error",
                })
                .then();
            break;
        case 401:
            message
                .open({
                    content: i18n.global.t("error.401"),
                    type: "error",
                })
                .then();
            break;
        case 403:
            message
                .open({
                    content: i18n.global.t("error.403"),
                    type: "error",
                })
                .then();
            break;
        case 404:
            message
                .open({
                    content: i18n.global.t("error.404"),
                    type: "error",
                })
                .then();
            break;
        case 408:
            message
                .open({
                    content: i18n.global.t("error.408"),
                    type: "error",
                })
                .then();
            break;
        case 500:
            message
                .open({
                    content: i18n.global.t("error.500"),
                    type: "error",
                })
                .then();
            break;
        case 501:
            message
                .open({
                    content: i18n.global.t("error.501"),
                    type: "error",
                })
                .then();
            break;
        case 502:
            message
                .open({
                    content: i18n.global.t("error.502"),
                    type: "error",
                })
                .then();
            break;
        case 503:
            message
                .open({
                    content: i18n.global.t("error.503"),
                    type: "error",
                })
                .then();
            break;
        case 504:
            message
                .open({
                    content: i18n.global.t("error.504"),
                    type: "error",
                })
                .then();
            break;
        case 505:
            message
                .open({
                    content: i18n.global.t("error.505"),
                    type: "error",
                })
                .then();
            break;
        default:
            message
                .open({
                    content: i18n.global.t("error.other") + `(${code})`,
                    type: "error",
                })
                .then();
            break;
    }
}
