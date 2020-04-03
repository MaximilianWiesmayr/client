import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {DataService} from '../../services/data.service';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private dataservice: DataService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.dataservice.user;
        const isLoggedIn = currentUser.username !== '' && currentUser.authToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.authToken}`
                }
            });
        }

        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api (401 - UNAUTHORIZED)
                this.dataservice.logout();
                location.reload();
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
