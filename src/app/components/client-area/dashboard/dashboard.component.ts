import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {DashboardInfoItem} from '../../../entities/dashboard-info-item';
import {HttpService} from '../../../services/http.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


    constructor(public dataservice: DataService, private httpService: HttpService) {
    }

    dashboardOverviewItems = [
        new DashboardInfoItem(
            'photo',
            'Photos',
            '20'
        ),
        new DashboardInfoItem(
            'storage',
            'Space available',
            '12GB / 15GB'
        ),
        new DashboardInfoItem(
            'account_box',
            'Current Subscription',
            '<span class = "' + this.dataservice.user.subscriptionStatus.toString() + '">'
            + this.dataservice.user.subscriptionStatus.toString() + '</span>'
        ),
        new DashboardInfoItem(
            'notification_important',
            'Notifications',
            '0'
        )

    ];

    ngOnInit(): void {
        this.httpService.getOverview(this.dataservice.user.username).subscribe(res => {
            alert(res);
        });
    }
}
