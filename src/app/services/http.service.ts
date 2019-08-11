import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../entities/User';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) {
    }

    // Sends a REST-Request to our Auth-Backend
    login(user: User) {
        return this.http.post(environment.apiUrl + 'auth/login', user);
    }

    // Sends a REST-Request to our Auth-Backend
    register(user: User) {
        return this.http.post(environment.apiUrl + 'auth/register', user);
    }

    // Sends the verificationcode from the email back to our Auth-Server
    verify(token: string) {
        return this.http.post(environment.apiUrl + 'auth/verify', token);
    }
}
