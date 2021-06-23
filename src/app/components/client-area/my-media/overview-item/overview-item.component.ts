import {Component, Input, OnInit} from '@angular/core';
import {DashboardInfoItem} from '../../../../entities/dashboard-info-item';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'overview-item',
    templateUrl: './overview-item.component.html',
    styleUrls: ['./overview-item.component.scss']
})
export class OverviewItemComponent implements OnInit {
    @Input() item: DashboardInfoItem;
    constructor() {
    }

    ngOnInit() {
    }

}
