import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'InstantGrade-Client';

    private viewLoadingCompleted = false;

    ngOnInit() {
        this.viewLoadingCompleted = false;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.viewLoadingCompleted = true;
        }, 5000);
    }
}
