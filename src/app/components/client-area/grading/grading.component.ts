import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
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
      category: 'Temperature',
      children: [
        {
          title: 'Temp.',
          min: 2000,
          max: 50000,
          step: 1,
          value: 26614,
          editValue: false
        },
        {
          title: 'Tint',
          min: -150,
          max: 150,
          step: 1,
          value: 0,
          editValue: false
        },
      ],
      locked: true
    },
    {
      category: 'Levels',
      children: [
        {
          title: 'Exposure',
          min: -5,
          max: 5,
          step: 0.1,
          value: 0,
          editValue: false
        },
        {
          title: 'Contrast',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Lights',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Depths',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'White',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Black',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
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
          editValue: false
        },
        {
          title: 'Green',
          min: -1,
          max: 10,
          step: 0.1,
          value: 0,
          editValue: false
        },
        {
          title: 'Blue',
          min: -1,
          max: 10,
          step: 0.1,
          value: 0,
          editValue: false
        }
      ],
      locked: true
    },
    {
      category: 'Presence',
      children: [
        {
          title: 'Clarity',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Dehaze',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Dynamics',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Saturation',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        }
      ],
      locked: true
    },
    {
      category: 'Curve',
      children: [],
      locked: true
    },
    {
      category: 'Sharpness',
      children: [
        {
          title: 'Amount',
          min: 0,
          max: 150,
          step: 1,
          value: 40,
          editValue: false
        },
        {
          title: 'Radius',
          min: 0,
          max: 3,
          step: .1,
          value: 1,
          editValue: false
        },
        {
          title: 'Details',
          min: 0,
          max: 100,
          step: 1,
          value: 25,
          editValue: false
        },
        {
          title: 'Mask',
          min: 0,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        }
      ],
      locked: true
    },
    {
      category: 'Noise Reduction',
      children: [
        {
          title: 'Luminance',
          min: 0,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Details',
          min: 0,
          max: 100,
          step: 1,
          value: 50,
          editValue: false
        },
        {
          title: 'Contrast',
          min: 0,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        }
      ],
      locked: true
    },
    {
      category: 'Vignette',
      children: [
        {
          title: 'Amount',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Center',
          min: 0,
          max: 100,
          step: 1,
          value: 50,
          editValue: false
        },
        {
          title: 'Roundness',
          min: -100,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
        {
          title: 'Smooth Edge',
          min: 0,
          max: 100,
          step: 1,
          value: 50,
          editValue: false
        },
        {
          title: 'Lights',
          min: 0,
          max: 100,
          step: 1,
          value: 0,
          editValue: false
        },
      ],
      locked: true
    },
    {
      category: 'Presets',
      children: [],
      locked: true
    },
  ];
  // Self explanatory (Setting)
  private current_editable_child;
  // Zoom Preview Image via mousewheel
  public default_image_scale = 1;
  // Indicator if Image is clicked (ready to move)
  public preview_clicked: boolean = false;
  // Preview Image DOM Element
  public PREVIMG = document.getElementsByTagName('img')[0];

  constructor(
    public dataservice: DataService,
    public websocketService: WebsocketService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
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

  ngOnInit() {
    this.dataservice.collapseEmitter.emit(true);
    this.websocketService.connect(environment.socketBaseUrl + 'grade', this.dataservice.user.authToken);
    if (this.dataservice.gradingImage && this.dataservice.gradingImage.path !== '') {
      this.websocketService.connectionEmitter.subscribe((connected: boolean) => {
        if (connected) {
          this.websocketService.importImage(this.dataservice.gradingImage);
        }
      });
    } else {
      this.openBrowser();
    }
  }

  // Method for sending the changes to the backend
  makeChanges(category: string, setting: string, value: number) {
    console.log(category + '_' + setting + ' > ' + value);
    value += 1; // Default value for css filter
    if (setting === 'Exposure') {
      document.getElementsByTagName('img')[0].style.filter =
        'brightness(' + value + ')';
    } else if (setting === 'Contrast') {
      document.getElementsByTagName('img')[0].style.filter =
        'contrast(' + value + ')';
    }
    this.websocketService.gradingEmitter.emit(new GradingSetting('setting', setting, value));
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
      slider.value = parseInt(newValue.value);
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
          images.push(new Image(img['customName'], img['factoryName'], img['filepath'], img['metadata'], img['owner']));
          /* tslint:enable:no-string-literal */
        }
        const dialogRef = this.dialog.open(ImageBrowserComponent, {
          width: '70%',
          data: {images}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dataservice.gradingImage = result;
          this.websocketService.importImage(this.dataservice.gradingImage);
          if (document.getElementById('prevIMG')) {
            document.getElementById('prevIMG').setAttribute('src', this.loadPreviewImage());
          }
        });
      }
    });

  }

  loadPreviewImage() {
    if (this.dataservice.gradingImage) {
      return this.dataservice.settings.domain + this.dataservice.gradingImage.path;
    }
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
export class ImageBrowserComponent {
// UploadDomain
  public uploadDomain: string = environment.publicDomain;

  constructor(
    private dataservice: DataService,
    public dialogRef: MatDialogRef<ImageBrowserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageBrowserData) {
  }


  setImage(img: Image) {
    if (img) {
      this.dialogRef.close(img);
    }
  }
}
