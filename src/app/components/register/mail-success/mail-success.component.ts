import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-mail-success',
    templateUrl: './mail-success.component.html',
    styleUrls: ['./mail-success.component.scss']
})
export class MailSuccessComponent implements OnInit {

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
    }

}
