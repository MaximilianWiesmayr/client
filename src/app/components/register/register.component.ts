import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormErrorStateMatcher} from '../../util/form-error-state-matcher';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    // Default Setting, if password field is hidden
    hide = true;
    // Register formgroup
    registerform: FormGroup;
    // Error State Matcher
    matcher = new FormErrorStateMatcher();

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

    constructor(public dataservice: DataService, private router: Router, private formBuilder: FormBuilder) {
        this.registerform = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[_@#$%]).{8,30})')]],
            confirmPassword: ['', Validators.required]
        }, {validator: this.checkPasswords});
    }

    ngOnInit() {
    }

    // Sends the register Request to our C++ Backend
    register() {
        // Check if the form is valid before sending to the Server
        if (this.registerform.valid) {
            this.btnOpts.active = true;
            setTimeout(() => {
                this.btnOpts.active = false;
                this.router.navigate(['/register/success']);
            }, 3350);
        }
    }

    // Password Validators
    checkPasswords(group: FormGroup) {
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : {notmatching: true};
    }
}
