export interface User {
    token?: string
    userId?: string

}

export interface AccountLogin {
    account?: string
    password?: string;
}
export interface PhoneLogin {
    phone?: string
    captcha?: string;
}
