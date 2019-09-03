import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {DataService} from './services/data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'InstantGrade-Client';

    constructor(breakpointObserver: BreakpointObserver, public dataservice: DataService) {
        // Detects changens to the Viewport and the format (Mobile, Desktop,..)
        breakpointObserver.observe([
            Breakpoints.HandsetLandscape,
            Breakpoints.HandsetPortrait
        ]).subscribe(result => {
            this.dataservice.isMobile = result.matches; // Returns true or false if the device is mobile
        });
    }

    private viewLoadingCompleted = false;

    ngOnInit() {
        this.viewLoadingCompleted = true;  // FOR DEV
        if (localStorage.getItem('user') !== null) {
            this.dataservice.user = JSON.parse(localStorage.getItem('user'));
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.viewLoadingCompleted = true;
        }, 5000);
    }
}
