import {Component, OnInit} from '@angular/core';
import {Image} from '../../../entities/Image';
import {ImageExtension} from '../../../enums/image-extension.enum';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-my-media',
    templateUrl: './my-media.component.html',
    styleUrls: ['./my-media.component.scss']
})
export class MyMediaComponent implements OnInit {
    public isInfoOpen = false;
    public images: Array<Image> = [
        new Image('TE', '20190411-DSCF0697', '/assets/', ImageExtension.JPG),
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG), // ../../../../assets/
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG),
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG),
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG),
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG),
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG),
    ];

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
    }

    // Receive Media from our Back-End via REST
    loadMedia() {
    }

    // Opens the Info dialog for the clicked image
    openInfo(image: Image) {
        this.isInfoOpen = true;
        // Sets the background-image of the preview
        document.getElementById('imagePreview').style.backgroundImage =
            'url("' + image.path + image.factoryTitle + '.' + image.extension + '")';
    }
}
