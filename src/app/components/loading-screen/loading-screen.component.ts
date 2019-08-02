import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
    }

}
