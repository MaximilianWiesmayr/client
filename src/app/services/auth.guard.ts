import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from './data.service';
import {AccountType} from '../enums/account-type.enum';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private router: Router, private dataservice: DataService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        /**
         * Check if User has a verified Account and a valid Token (For validating the JWT Token, I used an Interceptor.
         * See util/interceptors/auth-interceptor.ts how exactly I validated it.
         * */
        if (this.dataservice.user.accountType === AccountType.VERIFIED && this.dataservice.user.authToken) {
            return true;
        } else {
            this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.dataservice.user.accountType === AccountType.VERIFIED && this.dataservice.user.authToken) {

            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }

    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        if (this.dataservice.user.accountType === AccountType.VERIFIED && this.dataservice.user.authToken) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
