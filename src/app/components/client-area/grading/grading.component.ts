import {ChangeDetectorRef, Component, Inject, OnInit, HostListener, Directive, ViewChild, ElementRef} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSlideToggleChange} from '@angular/material';
import {WebsocketService} from 'src/app/services/websocket.service';
import {GradingSetting} from 'src/app/entities/grading-setting';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Image} from '../../../entities/Image';
import {HttpService} from '../../../services/http.service';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})

export class GradingComponent implements OnInit {
  // Array of available Grading options
  settings: Array<object> = [
    {
      category: 'Adjustments',
      children: [
        {
          title: 'Saturation',
          min: -5,
          max: 5,
          step: 0.1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Contrast',
          min: -5,
          max: 5,
          step: 0.1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Brightness',
          min: -5,
          max: 5,
          step: 0.1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Sharpness',
          min: -50,
          max: 50,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Blur',
          min: 0,
          max: 20,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        }
      ],
      locked: false
    },
    {
      category: 'Colors',
      children: [
        {
          title: 'Red',
          min: -1,
          max: 10,
          step: 0.1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Green',
          min: -1,
          max: 10,
          step: 0.1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Blue',
          min: -1,
          max: 10,
          step: 0.1,
          value: 0,
          editValue: false,
          savedValue: true
        }
      ],
      locked: true
    },
    {
      category: 'Filters',
      children: [
        {
          title: 'Dehaze',
          min: 0,
          max: 1,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Equalize',
          min: 0,
          max: 1,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Posterize',
          min: 0,
          max: 7,
          step: 1,
          value: 7,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Solarize',
          min: 0,
          max: 256,
          step: 1,
          value: 256,
          editValue: false,
          savedValue: true
        }
      ],
      locked: true
    },
    {
      category: 'Transform and Resize',
      children: [
        {
          title: 'Crop',
          min: 0,
          max: 1000,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Pad',
          min: -1000,
          max: 1000,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Mirror',
          min: 0,
          max: 1,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
        {
          title: 'Flip',
          min: 0,
          max: 1,
          step: 1,
          value: 0,
          editValue: false,
          savedValue: true
        },
      ],
      locked: true
    }
  ];
  // Self explanatory (Setting)
  private current_editable_child;
  // Zoom Preview Image via mousewheel
  public default_image_scale = 1;
  // Indicator if Image is clicked (ready to move)
  public preview_clicked: boolean = false;
  // Preview Image DOM Element
  public PREVIMG = document.getElementsByTagName('img')[0];
  public img;

  loadingdisplay = 'none';

  private previous = null;

  constructor(
    public dataservice: DataService,
    public websocketService: WebsocketService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    public cd: ChangeDetectorRef
  ) {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.websocketService.ws.close();
        this.dialog.closeAll();
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
    onKeyDown(e) {
        // optionally use preventDefault() if your combination
        // triggers other events (moving focus in case of Shift+Tab)
        // e.preventDefault();
        if(this.previous == 'Control' && e.key == 's'){
          e.preventDefault();
          this.prepareDownload();
        }
        this.previous = e.key;
    }

  ngOnInit() {
    this.dataservice.isUnsaved = true;
    this.dataservice.collapseEmitter.emit(true);
    this.websocketService.connect(environment.socketBaseUrl + 'grade', this.dataservice.user.authToken);
    if (this.dataservice.gradingImage && this.dataservice.gradingImage.filepath !== '') {
      this.websocketService.connectionEmitter.subscribe((connected: boolean) => {
        if (connected) {
          this.websocketService.importImage(this.dataservice.gradingImage);
          this.loadImage();
        }
      });
    } else {
      this.openBrowser();
    }
    this.dataservice.thumbnailEmitter.subscribe(res => {
      this.loadImage();
    });
  }

  toggleSliderChecked = false;

  toggleSliderChange(category: string, setting: string) {
    this.toggleSliderChecked = !this.toggleSliderChecked;
    console.log(this.toggleSliderChecked);
    if(this.toggleSliderChecked == false) {
      this.makeChanges(category, setting, 0);
    } else {
      this.makeChanges(category, setting, 1);
    }

  }

  // Method for sending the changes to the backend
  makeChanges(category: string, setting: string, value: number) {
    this.settings.find(e => e.category === category).children.find(f => f.title === setting).savedValue = false;
    console.log(category + '_' + setting + ' > ' + value);
    var values = [value];
    /*value += 1; // Default value for css filter
    if (setting === 'Exposure') {
      document.getElementsByTagName('img')[0].style.filter =
        'brightness(' + value + ')';
    } else if (setting === 'Contrast') {
      document.getElementsByTagName('img')[0].style.filter =
        'contrast(' + value + ')';
    }*/
    this.dataservice.isChanged = true;
    this.loadImage();
    this.websocketService.gradingEmitter.emit(new GradingSetting('setting', setting, values));
  }

  interval;
  activeInterval = false;

  possibleChanges(category: string, setting: string, value: number) {
    if(this.activeInterval){
      clearInterval(this.interval);
      this.activeInterval = false;
    }
    this.interval = setInterval(() => {
      this.makeChanges(category, setting, value);
      clearInterval(this.interval);
      this.activeInterval = false;
    },300);
    this.activeInterval = true;
  }

  // If the user wants to enter a custom value
  makeEditable(child) {
    if (this.current_editable_child !== undefined) {
      if (this.current_editable_child !== child) {
        this.current_editable_child.editValue = false;
      }
    }
    child.editValue = true;
    this.current_editable_child = child;
  }

  // Saves the custom value entered by the user
  saveNewValue(slider, child, newValue, category) {
    if (parseInt(newValue.value) > child.max) {
      slider.value = child.max;
      this.snackBar.open('The entered value cannot be higher than ' + child.max);
    } else if (parseInt(newValue.value) < child.min) {
      slider.value = child.min;
      this.snackBar.open('The entered value cannot be lower than ' + child.min);
    } else {
      slider.value = parseFloat(newValue.value);
    }
    this.makeChanges(category, child.title, slider.value);
    child.editValue = false;
    setTimeout(() => this.snackBar.dismiss(), this.dataservice.settings.snackBarTimeout);
  }

  // Changes via mousewheel
  mousewheelAction(direction, child, slider, category) {
    switch (direction) {
      case 'DOWN':
        slider.value -= slider.value > child.min ? child.step : 0;
        break;
      case 'UP':
        slider.value += slider.value < child.max ? child.step : 0;
        break;
      default:
        break;
    }
    this.makeChanges(category, child.title, slider.value);
  }

  // Zooms the Preview Image
  zoomImage(direction: string) {
    switch (direction) {
      case 'DOWN':
        this.default_image_scale -= this.default_image_scale > 0.01 ? .1 : 0;
        this.scaleImage();
        break;
      case 'UP':
        this.default_image_scale += .1;
        this.scaleImage();
        break;
      default:
        break;
    }
  }

  /** Moves the Zoomed Image */
  movePrevImage(event) {
    event.preventDefault();
    let x, y, imgX, imgY;
    if (this.preview_clicked && this.default_image_scale != 1) {
      x = event.clientX;
      y = event.clientY;
      imgX = this.PREVIMG.offsetLeft;
      imgY = this.PREVIMG.offsetTop;

      this.PREVIMG.style.transform =
        'translateX(' + (x - imgX) + 'px)';
      this.PREVIMG.style.transform =
        'translateY(' + (y - imgY) + 'px)';
    }
  }

  scaleImage() {
    document.getElementsByTagName('img')[0].style.transform =
      'scale(' + this.default_image_scale + ')';
  }

  resetZoom() {
    this.default_image_scale = 1;
    this.scaleImage();
  }

  /** Opens the Image Browser if no Image is selected*/
  openBrowser(): void {
    this.httpService.loadPhotos(this.dataservice.user.username).subscribe((res: Array<object>) => {
      const images: Array<Image> = [];
      if (res !== null) {
        for (const img of res) {

          /* tslint:disable:no-string-literal */
          images.push(new Image(img['customName'], img['factoryName'], img['filepath'], img['thumbnailPath'],
            img['metadata'], img['owner']));
          /* tslint:enable:no-string-literal */
        }
        const dialogRef = this.dialog.open(ImageBrowserComponent, {
          width: '70%',
          data: {images}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dataservice.gradingImage = result;
          this.websocketService.importImage(this.dataservice.gradingImage);
          /*if (document.getElementById('prevIMG')) {
            document.getElementById('prevIMG').setAttribute('src', this.loadImage());
          }*/
          this.loadImage();
        });
      }
    });

  }

  loadPreviewImage() {
    // console.log(this.dataservice.settings.stoploading);
    if (this.dataservice.gradingImage) {
      console.log(this.dataservice.settings.domain + this.dataservice.gradingImage.thumbnailPath);
      return this.dataservice.settings.domain + this.dataservice.gradingImage.thumbnailPath;
    } else {
      console.log(this.dataservice.settings.domain + 'uploads/loading.jpg');
      return this.dataservice.settings.domain + 'uploads/loading.jpg';
    }
  }

  loadImage() {
    this.loadingdisplay = 'block';
    if (!this.dataservice.isChanged) {
      this.httpService.getThumbnail().subscribe(result => {
        this.createImageFromBlob(result);
      });
    } else {
      this.httpService.getLoadImg().subscribe(result => {
        this.createImageFromBlob(result);
      });
      this.dataservice.isChanged = false;
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.img = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
    this.loadingdisplay = 'none';
  }

  prepareDownload() {
    this.loadingdisplay = 'block';
    this.loadImage();
    this.websocketService.exportImage(this.dataservice.gradingImage);
    this.dataservice.isUnsaved = false;
    this.loadingdisplay = 'none';
    this.settings.forEach(setting => setting.children.forEach(child => child.savedValue = true));
  }

}

export interface ImageBrowserData {
  images: Array<Image>;
}

/**
 * @title Image Browser
 * If no Image is selected
 */
@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser/image-browser.component.html',
  styleUrls: ['./image-browser/image-browser.component.scss']
})
export class ImageBrowserComponent implements OnInit {
// UploadDomain
  public uploadDomain: string = environment.publicDomain;

  constructor(
    private dataservice: DataService,
    public dialogRef: MatDialogRef<ImageBrowserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageBrowserData) {
  }

  ngOnInit(): void {
  }

  setImage(img: Image) {
    if (img) {
      this.dialogRef.close(img);
    }
  }
}
