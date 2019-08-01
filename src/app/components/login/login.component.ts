import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {MatProgressButtonOptions} from 'mat-progress-buttons';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router, public dataservice: DataService) {
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

    // Mehtod, which sends a REST Request to our Back-end
    login() {
        this.btnOpts.active = true;
        setTimeout(() => {
            this.btnOpts.active = false;
        }, 3350);
    }

    ngOnInit() {
    }

}
