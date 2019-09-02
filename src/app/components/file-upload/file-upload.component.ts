import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {DataService} from '../../services/data.service';
import {MatSnackBar} from '@angular/material';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

    files: any = [];

    constructor(private httpService: HttpService, private dataservice: DataService, private snackBar: MatSnackBar) {
    }

    uploadFile(event) {
        const formData = new FormData();
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            formData.append('owner', this.dataservice.user.username);
            formData.append('file', element, element.name);
            this.files.push(element.name);
            this.httpService.uploadImage(formData).subscribe(res => {
                    /* tslint:disable:no-string-literal */
                    if (res['status'] === 'success') {
                        this.snackBar.open('Image: ' + res['fileName'] + ' successfully uploaded.', '✔');
                    } else {
                        this.snackBar.open('ERROR: ' + res['exception'], 'Try again');
                    }
                    setTimeout(() => this.snackBar.dismiss(), this.dataservice.settings.snackBarTimeout);
                },
                err => {
                    console.log(err);
                });
            /* tslint:enable:no-string-literal */
        }
    }

    deleteAttachment(index) {
        this.files.splice(index, 1);
    }

    ngOnInit() {
    }

}
