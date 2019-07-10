import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MatProgressButtonOptions} from 'mat-progress-buttons';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    // Button Options
    btnOpts: MatProgressButtonOptions = {
        active: false,
        text: 'Register',
        spinnerSize: 19,
        raised: true,
        stroked: false,
        buttonColor: 'primary',
        spinnerColor: 'warn',
        fullWidth: true,
        disabled: false,
        mode: 'indeterminate',
    };

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
    }

    register() {
        this.btnOpts.active = true;
        setTimeout(() => {
            this.btnOpts.active = false;
        }, 3350);
    }
}
