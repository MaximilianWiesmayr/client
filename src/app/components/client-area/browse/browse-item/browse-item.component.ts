import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../../../services/data.service';
import {Image} from '../../../../entities/Image';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'browse-item',
  templateUrl: './browse-item.component.html',
  styleUrls: ['./browse-item.component.scss']
})
export class BrowseItemComponent implements OnInit {
  @Input() image: Image = new Image();
  public uploadDomain: string = environment.publicDomain;

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }

}
