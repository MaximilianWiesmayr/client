import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public navItems: Array<object> = [
        {
            title: 'Dashboard',
            icon: 'dashboard',
            route: '',
            active: true
        },
        {
            title: 'My Photos',
            icon: 'folder', // photo_library
            route: '',
            active: false
        },
        {
            title: 'Browse',
            icon: 'cloud_circle',
            route: '',
            active: false
        },
        {
            title: 'Logout',
            icon: 'logout',
            route: '',
            active: false
        }
    ];

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
    }

}
