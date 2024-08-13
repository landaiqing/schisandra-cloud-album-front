export interface User {
    accessToken?: string
    userId?: string
    refreshToken?: string
    expiresAt?: number

}

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
