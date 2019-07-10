import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router, public dataservice: DataService) {
    }

    ngOnInit() {
    }

}
