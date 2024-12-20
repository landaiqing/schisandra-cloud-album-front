export interface AccountLogin {
    account?: string
    password?: string;
    auto_login?: boolean;
    angle: number,
    key: string,
}

export interface PhoneLogin {
    phone?: string
    captcha?: string;
    auto_login?: boolean;
}

export interface ResetPassword {
    phone?: string
    captcha?: string;
    password?: string;
    repassword?: string;
}

export interface WechatOffiaccountLogin {
    openid:string;
    client_id:string;
}
