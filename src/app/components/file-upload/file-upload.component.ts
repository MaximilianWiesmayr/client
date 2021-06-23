import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {DataService} from '../../services/data.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  files: Array<object> = [];

  constructor(private httpService: HttpService,
              private dataservice: DataService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  uploadFile(event) {
    var formData = new FormData();
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < event.length; index++) {
        this.dataservice.isUploading = true;
        const element = event[index];
        console.log(index);
        formData.append('owner', this.dataservice.user.username);
        formData.append('file', element, element.name);
        this.files.push({name: element.name, status: 'pending'});
        this.httpService.uploadImage(formData).subscribe(res => {
            /* tslint:disable:no-string-literal */
            if (res['status'] === 'success') {
              this.dataservice.isUploading = false;
              this.dataservice.imageStatusEmitter.emit(null);
              this.snackBar.open('Image: ' + res['fileName'] + ' successfully uploaded.', '✔');
              this.files.forEach(f => {
                if (f['name'] === element.name) {
                  f['status'] = 'uploaded';
                }
              });
            } else {
              this.snackBar.open('ERROR: ' + res['exception'], 'Try again');
              this.files.forEach(f => {
                if (f['name'] === element.name) {
                  f['status'] = 'cancelled';
                }
              });
            }
            setTimeout(() => this.snackBar.dismiss(), this.dataservice.settings.snackBarTimeout);

          },
          err => {
            console.log(err);
          });
          formData = new FormData();
        /* tslint:enable:no-string-literal */
      }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  changeClasses(file) {
    switch (file.status) {
      case 'uploaded':
        return 'files-list uploaded';
      case 'cancelled':
        return 'files-list cancelled';
      default:
        return 'files-list';
    }
  }

  ngOnInit() {
  }
}
