import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  returnUrl: string = '';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dataservice: DataService,
    private http: HttpService,
    private snackBar: MatSnackBar
  ) {
  }

  // Method, which sends a REST Request to our Back-end
  login() {
    this.btnOpts.active = true;
    this.http.login(this.dataservice.user).subscribe(res => {
        this.btnOpts.active = false;
        /* tslint:disable:no-string-literal */
        if (res['status'] === 'success') {
          this.dataservice.user = res['user'];
          this.dataservice.user.settings = JSON.parse(res['user'].settings);
          this.dataservice.user.authToken = res['token'];
          localStorage.setItem('user', JSON.stringify(this.dataservice.user));
          this.router.navigate([this.returnUrl]);
        } else {
          this.snackBar.open('ERROR: ' + res['exception'], 'Try again');
        }
        /* tslint:enable:no-string-literal */
      },
      error => {
        this.btnOpts.active = false;
        this.snackBar.open('ERROR: ' + error, 'Try again');

      });
  }

  ngOnInit() {
    this.dataservice.isUnsaved = false;
    // Reset login status
    this.dataservice.logout();
    /* tslint:disable:no-string-literal */
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/photos';
    /* tslint:enable:no-string-literal */
    this.route.queryParams.subscribe(params => {
      if (params.errorMSG) {
        this.snackBar.open('ERROR: ' + params.errorMSG);

      }
    });
  }

}
