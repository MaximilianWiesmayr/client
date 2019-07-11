import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-mail-failed',
    templateUrl: './mail-failed.component.html',
    styleUrls: ['./mail-failed.component.scss']
})
export class MailFailedComponent implements OnInit {

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
    }

}
