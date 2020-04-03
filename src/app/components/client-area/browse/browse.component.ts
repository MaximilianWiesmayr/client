import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {Image} from '../../../entities/Image';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  public images: Array<Image> = [];

  constructor(public dataservice: DataService, private httpService: HttpService) {
  }

  ngOnInit() {
    this.loadPublishedImages();
  }

  loadPublishedImages() {
    // TODO Backend-Method
    // Dummy Method own Images
    this.httpService.loadPhotos(this.dataservice.user.username).subscribe((res: Array<object>) => {
      if (res !== null) {
        for (const img of res) {
          /* tslint:disable:no-string-literal */
          this.images.push(new Image(img['customName'], img['factoryName'], img['filepath'], img['metadata'], img['owner']));
          /* tslint:enable:no-string-literal */
        }
      }
    });
  }
}
