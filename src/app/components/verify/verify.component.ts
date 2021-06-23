import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {HttpService} from '../../services/http.service';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

    public title = '';
    returnUrl: string = '';

    constructor(
      private route: ActivatedRoute,
      public dataservice: DataService,
      private http: HttpService,
      private snackBar: MatSnackBar,
      private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const userId = params.id;
            // Sends a REST-Request to our backend
            this.http.verify(userId).subscribe(res => {
                /* tslint:disable:no-string-literal */
                if (res['status'] === 'success') {
                    this.title = 'Account successfully activated';
                    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
                    this.router.navigate([this.returnUrl]);
                    this.snackBar.open('Account successfully activated', '✔');
                    setTimeout(() => this.snackBar.dismiss(), 10000);
                } else {
                    this.title = 'Activation failed! --> ' + res['exception'] || '';
                }
                /* tslint:enable:no-string-literal */
            });
        });
    }

}
