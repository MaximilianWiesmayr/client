import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {HttpService} from '../../services/http.service';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

    private title = '';

    constructor(private activatedRoute: ActivatedRoute, public dataservice: DataService, private http: HttpService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            const userId = params.id;
            this.http.verify(userId).subscribe(res => {
                if (res['status'] === 'success') {
                    this.title = 'YEET! Erfolgreich Aktiviert!';
                } else {
                    this.title = 'DAMN! Aktivierung fehlgeschlagen!';
                }
            });
        });
    }

}
