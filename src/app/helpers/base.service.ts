import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/Observable/ErrorObservable";

import { AuthenticationService } from '../shared/authentication.service';
import { BASIC_REQUEST_HEADERS, BASIC_UPLOAD_HEADERS } from '../app.config';
import { Helpers } from '../helpers/helpers';

@Injectable()
export class BaseService {

    constructor(public auth: AuthenticationService) {
    }

    protected getHeaders(): Headers {
        let headers = new Headers(BASIC_REQUEST_HEADERS);
        headers.append('Authorization', Helpers.prepareAuthenticationBody(
            this.auth.auth.authKey,
            this.auth.auth.loginAuthKey));
        return headers;
    }

    protected getUploadHeaders(): Headers {
        let headers = new Headers(BASIC_UPLOAD_HEADERS);
        headers.append('Authorization', Helpers.prepareAuthenticationBody(
            this.auth.auth.authKey,
            this.auth.auth.loginAuthKey));
        return headers;
    }

    protected extractDataArray<T>(model: { new(): T; }, res: Response): Array<T> {
        let arrayObj: Array<T> = Array<T>();
        if (res.status == 200 || res.status == 201 || res.status == 204) {
            let data = res.json();
            arrayObj = <Array<T>>data.items;
        }
        return arrayObj;
    }

    protected extractDataSingle<T>(model: { new(): T; }, res: Response): T {
        let obj: T;
        if (res.status == 200 || res.status == 201 || res.status == 204) {
            let data = res.json();
            obj = <T>data;
        }
        return obj;
    }

    protected extractDataSimple(res: Response): boolean {
        if (res.status == 200 || res.status == 201 || res.status == 204) {
            return true;
        }
        return false;
    }

    protected handleError(error: any) {
        let errMsg = (JSON.parse(error._body).message) ? JSON.parse(error._body).message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(error);
        return Observable.throw(errMsg);
    }
}