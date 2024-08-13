
export interface AccountLogin {
    account?: string
    password?: string;
}

export interface PhoneLogin {
    phone?: string
    captcha?: string;
}

export interface ResetPassword {
    phone?: string
    captcha?: string;
    password?: string;
    repassword?: string;
}
