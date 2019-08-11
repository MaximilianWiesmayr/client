import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, public dataservice: DataService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            const userId = params.id;
            console.log(userId);
        });
    }

}
