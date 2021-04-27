import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {DashboardInfoItem} from '../../../entities/dashboard-info-item';
import {HttpService} from '../../../services/http.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  dashboardOverviewItems: Array<DashboardInfoItem>;

  constructor(public dataservice: DataService, private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.updateOverview();
    this.dataservice.imageStatusEmitter.subscribe(() => this.updateOverview());
  }

  updateOverview() {

    this.httpService.getOverview(this.dataservice.user.username).subscribe(res => {
        this.dashboardOverviewItems = [
          /* tslint:disable:no-string-literal */
          new DashboardInfoItem(
            'photo',
            'Photos',
            res['photos']
          ),
          new DashboardInfoItem(
            'storage',
            'Space used',
            res['disc_space']
          ),
          new DashboardInfoItem(
            'account_box',
            'Current Subscription',
            '<span class = "' + res['subscription'] + '">'
            + res['subscription'] + '</span>'
          ),
          new DashboardInfoItem(
            'notification_important',
            'Notifications',
            res['notifications']
          )
          /* tslint:enable:no-string-literal */
        ];
      },
      error => this.router.navigate(['login'], {queryParams: {errorMSG: error}}));
  }
}
