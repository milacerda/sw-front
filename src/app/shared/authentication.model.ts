import { User } from './user.module';

export class AuthenticationModel {
    authKey: string;
    loginAuthKey: string;
    // facebookAuthKey: string;
    status: boolean;
    registration: boolean;
    message: string;
    user: User;

    constructor(status: boolean, message: string) {
        this.status = status;
        this.message = message;
    }
}
