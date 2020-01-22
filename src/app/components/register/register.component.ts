import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormErrorStateMatcher} from '../../util/form-error-state-matcher';
import {Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {MatSnackBar} from '@angular/material';

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

  constructor(
    public dataservice: DataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private snackBar: MatSnackBar
  ) {
    // Build the validation Pattern for our Form
    this.registerform = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/\d/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.minLength(8)
      ])],
      // password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[_@#$%]).{8,30})')]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.checkPasswords});
  }

  ngOnInit() {
  }

  // Sends the register Request to our JAVA Backend
  register() {
    // Check if the form is valid before sending to the Server
    if (this.registerform.valid) {
      this.dataservice.user.username = this.registerform.get('username').value;
      this.dataservice.user.firstname = this.registerform.get('firstname').value;
      this.dataservice.user.lastname = this.registerform.get('lastname').value;
      this.dataservice.user.email = this.registerform.get('email').value;
      this.dataservice.user.password = this.registerform.get('password').value;
      this.btnOpts.active = true;
      this.http.register(this.dataservice.user).subscribe(r => {
        /* tslint:disable:no-string-literal */
        this.btnOpts.active = false;
        if (r['status'] === 'success') {
          this.router.navigate(['/register/success']);
        } else {
          this.snackBar.open('ERROR: ' + r['exception'], 'Try again');
        }
        /* tslint:enable:no-string-literal */
      }, error => {
        console.log(error);
        this.btnOpts.active = false;
      });
      /*  setTimeout(() => {
            this.btnOpts.active = false;
            this.router.navigate(['/register/success']);
        }, 3350);*/
    }
  }

  // Password Validators
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : {notmatching: true};
  }
}
