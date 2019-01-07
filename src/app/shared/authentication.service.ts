import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import {
    URL_USER,
    URL_LOGOUT,
    BASIC_REQUEST_HEADERS,
    URL_BASIC_LOGIN,
    URL_BASIC_SINGUP,
    URL_RESET_REQUEST,
    URL_CHANGE_PASS,
    URL_VALIDATE_TOKEN,
    URL_NEW_PASS
} from '../app.config';

// import { LoginComponent } from '../login/login.component';
import {
    NbAuthComponent,
    NbLoginComponent,
    NbLogoutComponent,
    NbRegisterComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
} from '@nebular/auth';

import { AuthenticationModel } from './authentication.model';
import { User } from './user.module';
import { Helpers } from '../helpers/helpers';

@Injectable()
export class AuthenticationService {
    @Output() onAuth: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onResetKeySent: EventEmitter<boolean> = new EventEmitter<boolean>();
    public auth: AuthenticationModel;
    public onHold: boolean = false;
    public sent: boolean = false;
    public loginComponent: NbLoginComponent;
    public onRegister: boolean = false;

    constructor(private http: Http) {
        this.clear();
    }

    public validateUser(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.auth.status === true) {
                resolve(true);
            } else {
                if (Cookie.get('authKey') && Cookie.get('loginAuthKey')) {
                    let res = false;
                    let bodyParams: Array<[string, any]> = new Array<[string, any]>();
                    bodyParams.push(['authKey', Cookie.get('authKey')]);
                    bodyParams.push(['loginAuthKey', Cookie.get('loginAuthKey')]);

                    let body = Helpers.arrayToRequestBody(bodyParams);
                    let headers = new Headers(BASIC_REQUEST_HEADERS);

                    this.http.post(URL_VALIDATE_TOKEN, body, { headers: headers })
                        .subscribe(
                            data => {
                                let res = this.extractData(data);
                                //console.log('##########guard############');
                                //console.log(res);
                                resolve(res);
                            },
                            error => resolve(false));
                } else {
                    resolve(false);
                }
            }
        });
    }

    public validatePublicUser(): Promise<boolean> {
        let ret;
        this.validateUser().then(
            data => data ? ret = Promise.resolve(false) : ret = Promise.resolve(true));
        return ret;
    }

    public validateToken(authKey: string, loginAuthKey: string) {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        bodyParams.push(['authKey', authKey]);
        bodyParams.push(['loginAuthKey', loginAuthKey]);

        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        return this.basicRequest(URL_VALIDATE_TOKEN, body, headers);
    }

    public refreshData(): void {
        this.http.get(URL_USER, { headers: this.getHeaders() })
            .subscribe(
                data => {
                    let user = this.extractDataSingle<User>(User, data);
                    if (user) {
                        this.auth.user = user;
                    }
                },
                error => ''
            );
    }

    public basicLogin(usr: string, pass: string) {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        bodyParams.push(['emailAddress', usr]);
        bodyParams.push(['password', pass]);
        bodyParams.push(['loginType', 'default']);

        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        return this.basicRequest(URL_BASIC_LOGIN, body, headers);
    }

    // public facebookLogin(email: string, fbId: string, fbProfilePic: string, fbProfileName: string) {
    //     let bodyParams: Array<[string, any]> = new Array<[string, any]>();
    //     bodyParams.push(['emailAddress', email]);
    //     bodyParams.push(['facebookId', fbId]);
    //     bodyParams.push(['facebookProfilePicture', fbProfilePic]);
    //     bodyParams.push(['facebookProfileName', fbProfileName]);
    //     bodyParams.push(['loginType', 'facebook']);

    //     let body = Helpers.arrayToRequestBody(bodyParams);
    //     let headers = new Headers(BASIC_REQUEST_HEADERS);

    //     return this.basicRequest(URL_BASIC_LOGIN, body, headers);
    // }

    // public googleLogin(email: string, googleId: string, googleProfilePic: string, googleProfileName: string) {
    //     let bodyParams: Array<[string, any]> = new Array<[string, any]>();
    //     bodyParams.push(['emailAddress', email]);
    //     bodyParams.push(['googleId', googleId]);
    //     bodyParams.push(['googleProfileName', googleProfileName]);
    //     bodyParams.push(['loginType', 'google']);
    //     if (googleProfilePic !== '')
    //         bodyParams.push(['googleProfilePicture', googleProfilePic]);

    //     let body = Helpers.arrayToRequestBody(bodyParams);
    //     let headers = new Headers(BASIC_REQUEST_HEADERS);

    //     return this.basicRequest(URL_BASIC_LOGIN, body, headers);
    // }

    public basicSingup(name: string, email: string, pass: string, confPass: string) {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        this.onRegister = true;
        bodyParams.push(['fullName', name]);
        bodyParams.push(['email', email]);
        bodyParams.push(['newPassword', pass]);
        bodyParams.push(['newPasswordConfirm', confPass]);


        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        return this.basicRequest(URL_BASIC_SINGUP, body, headers);
    }

    public requestPassReset(email: string) {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        bodyParams.push(['email', email]);

        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        return this.resetRequest(URL_RESET_REQUEST, body, headers);
    }

    public passChange(key: string, pass: string, passConf: string) {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        bodyParams.push(['resetKey', key]);
        bodyParams.push(['newPassword', pass]);
        bodyParams.push(['newPasswordConfirm', passConf]);

        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        return this.resetRequest(URL_CHANGE_PASS, body, headers);
    }

    public newPassword(userId: number, currentPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        bodyParams.push(['userId', userId]);
        bodyParams.push(['currentPassword', currentPassword]);
        bodyParams.push(['newPassword', newPassword]);
        bodyParams.push(['newPasswordConfirm', confirmPassword]);

        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        this.newPassRequest(URL_NEW_PASS, body, headers);

        return new Promise<boolean>((resolve) => {
            if (this.auth.status === true) {
                this.onHold = false;
                resolve(true);
            } else {
                this.onHold = false;
                resolve(false);
            }
        });
    }

    public logOut(): void {
        let bodyParams: Array<[string, any]> = new Array<[string, any]>();
        bodyParams.push(['loginAuthKey', this.auth.loginAuthKey]);
        let body = Helpers.arrayToRequestBody(bodyParams);
        let headers = new Headers(BASIC_REQUEST_HEADERS);

        this.onHold = true;
        Cookie.delete('authKey', '/');
        Cookie.delete('loginAuthKey', '/');
        this.clear();

        this.http.post(URL_LOGOUT, body, { headers: headers })
            .subscribe(
                res => this.onHold = false,
                error => this.onHold = false,
                () => this.onHold = false
            );
    }

    private basicRequest(url: string, body: string, headers: Headers) {
        this.onHold = true;
        this.clear();
        this.http.post(url, body, { headers: headers })
            .subscribe(
                res => (this.extractData(res)),
                error => (this.handleError(error)),
                () => (this.onHold = false));
    }

    private extractData(res: Response): boolean {
        let data = res.json();
        if (data.status.success) {
            this.setAuth(<AuthenticationModel>data);
            this.auth.status = true;
            this.onAuth.emit(true);
            Cookie.set('authKey', this.auth.authKey, 1, '/');
            Cookie.set('loginAuthKey', this.auth.loginAuthKey, 1, '/');
            this.onHold = false;
            return true;
        } else {
            if (data.status.firstError[Object.keys(data.status.firstError)[0]]) {
                console.log(data.status.firstError[Object.keys(data.status.firstError)[0]]);
                this.setAuth(new AuthenticationModel(false, data.status.firstError[Object.keys(data.status.firstError)[0]].toString()));
                this.onAuth.emit(false);
            } else {
                this.setAuth(new AuthenticationModel(false, 'Server error'));
                this.onAuth.emit(false);
            }
            this.onHold = false;
            return false;
        }
    }

    private newPassRequest(url: string, body: string, headers: Headers) {
        //this.onHold = true;
        //this.clear();
        this.http.post(url, body, { headers: headers })
            .subscribe(
                res => (this.extractNewPassData(res)),
                error => (this.handleError(error)),
                () => (this.onHold = false));
    }

    private extractNewPassData(res: Response) {
        let data = res.json();
        //this.onHold = true;
        if (data.status.success) {
            this.auth.status = true;
            this.onResetKeySent.emit(true);
        } else {
            if (data.status.firstError[Object.keys(data.status.firstError)[0]]) {
                //console.error(data.status.firstError[Object.keys(data.status.firstError)[0]]);
                //this.setAuth(new AuthenticationModel(false, data.status.firstError[Object.keys(data.status.firstError)[0]].toString()));
                this.auth.message = data.status.firstError[Object.keys(data.status.firstError)[0]].toString();
                this.auth.status = false;
            } else {
                //this.setAuth(new AuthenticationModel(false, 'Server error'));
                this.auth.message = 'Server error';
                this.auth.status = false;
            }
            this.onResetKeySent.emit(false);
        }
        this.sent = true;
        this.onHold = false;
    }

    private resetRequest(url: string, body: string, headers: Headers) {
        this.onHold = true;
        this.clear();
        this.http.post(url, body, { headers: headers })
            .subscribe(
                res => (this.extractResetData(res)),
                error => (this.handleError(error)),
                () => (this.onHold = false));
    }

    private extractResetData(res: Response) {
        let data = res.json();
        if (data.status.success) {
            this.onResetKeySent.emit(true);
        } else {
            if (data.status.firstError[Object.keys(data.status.firstError)[0]]) {
                console.error(data.status.firstError[Object.keys(data.status.firstError)[0]]);
                this.setAuth(new AuthenticationModel(false, data.status.firstError[Object.keys(data.status.firstError)[0]].toString()));
            } else {
                this.setAuth(new AuthenticationModel(false, 'Server error'));
            }
            this.onResetKeySent.emit(false);
        }
        this.onHold = false;
    }

    private handleError(error: any) {
        let errMsg = 'Server error';
        console.error(errMsg + ' - ' + error);
        this.onAuth.emit(false);
        this.onResetKeySent.emit(false);
        this.setAuth(new AuthenticationModel(false, errMsg));
        this.onHold = false;
    }

    public setAuth(auth: AuthenticationModel) {
        this.auth = auth;
    }

    public clear() {
        this.auth = new AuthenticationModel(false, '');
    }

    //helpers
    private getHeaders(): Headers {
        let headers = new Headers(BASIC_REQUEST_HEADERS);
        headers.append('Authorization', Helpers.prepareAuthenticationBody(
            this.auth.authKey,
            this.auth.loginAuthKey));
        return headers;
    }

    private extractDataSingle<T>(model: { new(): T; }, res: Response): T {
        let obj: T;
        if (res.status == 200 || res.status == 201 || res.status == 204) {
            let data = res.json();
            obj = <T>data;
        }
        return obj;
    }
}