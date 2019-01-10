export const BASIC_REQUEST_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json; charset=utf-8'
}
export const BASIC_UPLOAD_HEADERS = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json; charset=utf-8'
}

// export const URL_BASE_REST: string = 'http://localhost/sw/public/'; //Local
export const URL_BASE_REST: string = 'https://api-sw.herokuapp.com/api'; //Prod demo

export const URL_VALIDATE_TOKEN: string = URL_BASE_REST + 'authentication/validate-auth-token';
export const URL_LOGOUT: string = URL_BASE_REST + 'authentication/logout';
export const URL_BASIC_LOGIN: string = URL_BASE_REST + 'authentication/login';
export const URL_BASIC_SINGUP: string = URL_BASE_REST + 'authentication/registration';
export const URL_RESET_REQUEST: string = URL_BASE_REST + 'authentication/forgot-password';
export const URL_CHANGE_PASS: string = URL_BASE_REST + 'authentication/reset-password';
export const URL_NEW_PASS: string = URL_BASE_REST + 'authentication/new-password';

export const URL_PLANETS: string = URL_BASE_REST + 'planets';
export const URL_USER: string = URL_BASE_REST + 'user';