import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {HttpService} from '../../services/http.service';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(
        private router: Router,
        public dataservice: DataService,
        private http: HttpService,
        private snackBar: MatSnackBar
    ) {
    }


    // Button Options
    btnOpts: MatProgressButtonOptions = {
        active: false,
        text: 'Login',
        spinnerSize: 19,
        raised: true,
        stroked: false,
        buttonColor: 'primary',
        spinnerColor: 'warn',
        fullWidth: true,
        disabled: false,
        mode: 'indeterminate',
    };

    // Method, which sends a REST Request to our Back-end
    login() {
        this.btnOpts.active = true;
        this.http.login(this.dataservice.user).subscribe(res => {
            this.btnOpts.active = false;
            /* tslint:disable:no-string-literal */
            if (res['status'] === 'success') {
                this.dataservice.user = res['user'];
                this.dataservice.user.settings = JSON.parse(res['user'].settings);
                localStorage.setItem('user', JSON.stringify(this.dataservice.user));
                this.router.navigate(['dashboard']);
            } else {
                this.snackBar.open('ERROR: ' + res['exception'], 'Try again');
            }
            /* tslint:enable:no-string-literal */
        });
    }

    ngOnInit() {
    }

}
