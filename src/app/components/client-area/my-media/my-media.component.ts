import {Component, Inject, OnInit} from '@angular/core';
import {Image} from '../../../entities/Image';
import {DataService} from '../../../services/data.service';
import {MatBottomSheet, MatBottomSheetRef, MatTableDataSource} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import { saveAs } from '@progress/kendo-file-saver';
import {DashboardInfoItem} from '../../../entities/dashboard-info-item';

// Interface for our deletion - popup
export interface ImageDelete {
    delete: boolean;
    image: Image;
}

export interface ImageDownload {
    type: string;
    image: Image;
}

export interface ImageReset {
    reset: boolean;
    image: Image;
}

export interface MetaElement {
    key: string;
    value: any;
}
@Component({
    selector: 'app-my-media',
    templateUrl: './my-media.component.html',
    styleUrls: ['./my-media.component.scss']
})
export class MyMediaComponent implements OnInit {
    // Indicates if the Detail Sidebar is open or not
    public isInfoOpen = false;
    // Dummy Images later replaced by our HTTP Request
    public images: Array<Image> = [];
    // The currently selected Image (by clicking on it to open the Details)
    public selectedImage: Image = new Image();
    // UploadDomain
    public uploadDomain: string = environment.publicDomain;
    // Metadata Map of the selected Image (All metadata)
    public metaList: Array<MetaElement> = [];
    // Table Datasource
    public datasource;
    public displayedColumns: Array<string> = ['key', 'value'];
    public img;

    dashboardOverviewItems: Array<DashboardInfoItem>;

    constructor(
        public dataservice: DataService,
        private httpService: HttpService,
        private socialSheet: MatBottomSheet,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.loadMedia();
        this.updateOverview();
        this.dataservice.imageStatusEmitter.subscribe(() =>
        {
          this.updateOverview();
          this.images = [];
          this.loadMedia();
        });
    }

    updateOverview() {
      this.httpService.getOverview(this.dataservice.user.username).subscribe(res => {
          this.dashboardOverviewItems = [
            /* tslint:disable:no-string-literal */
            new DashboardInfoItem(
              'storage',
              'Space used',
              res['disc_space']
            ),
            new DashboardInfoItem(
              'photo',
              'Photos',
              res['photos']
            )
            ,
            /*new DashboardInfoItem(
              'account_box',
              'Current Subscription',
              '<span class = "' + res['subscription'] + '">'
              + res['subscription'] + '</span>'
            )*/

            /* tslint:enable:no-string-literal */
          ];
        },
        error => this.router.navigate(['login'], {queryParams: {errorMSG: error}}));
    }

    // Receive Media from our Back-End via REST
    loadMedia() {
        this.httpService.loadPhotos(this.dataservice.user.username).subscribe((res: Array<object>) => {
            if (res !== null) {
                for (const img of res) {
                  /* tslint:disable:no-string-literal */
                  // tslint:disable-next-line:max-line-length
                  const meta: object = JSON.parse(img['metadata']);
                  const forFileSize = (meta["File Size"].replace('bytes','')/1000000).toFixed(2);
                  this.images.push(new Image(img['customName'], img['factoryName'], img['filepath'], img['thumbnailPath'] ,img['metadata'], img['owner'], forFileSize + ' MB'));
                  /* tslint:enable:no-string-literal */
                }
            }
        });
    }

    // Opens the Info dialog for the clicked image
    openInfo(image: Image) {
        // Sets the current Image
        this.selectedImage = image;
        // Resets the MetaMaps
        this.metaList = [];
        const meta: object = JSON.parse(image.metadata);
      this.metaList.push({key: 'Filename', value: this.selectedImage.factoryTitle});
      this.metaList.push({key: 'Owner', value: this.selectedImage.owner});
      Object.keys(meta).filter(key => !key.includes('Unknown') && !key.includes('TRC')).forEach(key => {
        this.metaList.push({key: key.trim(), value: meta[key].trim()});
      });
        this.datasource = new MatTableDataSource(this.metaList);
        // filters the general meta of an image
        // this.setOverviewMeta();t
        // Sets the opening indicator to true
        this.isInfoOpen = true;
        // Sets the background-image of the preview
      console.log(this.uploadDomain + ' ' + image.thumbnailPath);
        document.getElementById('imagePreview').style.backgroundImage =
            'url("' + this.uploadDomain + '/' + image.thumbnailPath + '")';
    }

  openDownload() {
    const dialogRef = this.dialog.open(DownloadDialogComponent, {
      width: '300px',
      panelClass: this.dataservice.user.settings.darkmode ? 'dark' : '',
      data: {image: this.selectedImage, type: 'tiff'}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.httpService.preparedownloadImage(this.selectedImage.filepath, result).subscribe(res => {
        if (res['status'] === 'success') {
          alert(res['path']);
          this.httpService.downloadImage(res['path']).subscribe(res => {
            let blob:any = new Blob([res], { type: 'image/' + result});
            const url = window.URL.createObjectURL(blob);
            saveAs(blob, 'downloadedImage.' + result);
          }), error => console.log('Error downloading the file'),
            () => console.info('File downloaded successfully');
        }
      });
    });
  }

  openSharingFeed(): void {
    this.socialSheet.open(SocialSharingSheetComponent, {
      panelClass: this.dataservice.user.settings.darkmode ? 'dark' : ''
    });
  }
        //this.socialSheet.open(SocialSharingSheetComponent, {
        //    panelClass: this.dataservice.user.settings.darkmode ? 'dark' : ''
        //});

    // Opens the popup for deleting the image
    openDeleteDialog(): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '250px',
            panelClass: this.dataservice.user.settings.darkmode ? 'dark' : '',
            data: {image: this.selectedImage, delete: false}
        });
        // After the popup is closed, this Method will be triggered
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteImage(this.selectedImage);
                this.httpService.deletePhoto(this.selectedImage.factoryTitle, this.selectedImage.owner).subscribe(res => {
                    if (res['status'] === 'success') {
                        this.isInfoOpen = false;
                        this.snackBar.open('Image successfully deleted.', 'Undo');
                        setTimeout(() => this.snackBar.dismiss(), this.dataservice.settings.snackBarTimeout);
                        // Method for restoring the previous deleted image
                        this.snackBar._openedSnackBarRef.onAction().subscribe(() => {
                            this.httpService.recoverPhoto(this.selectedImage.factoryTitle, this.selectedImage.owner).subscribe(res => {
                                if (res['status'] === 'success') {
                                    this.images.push(this.selectedImage);
                                    this.snackBar.open('Image successfully recovered.', '✔');
                                    setTimeout(() => this.snackBar.dismiss(), this.dataservice.settings.snackBarTimeout);
                                }
                            });
                        });
                    }
                });

            }
        });
    }

    openResetChanges() {
      const dialogRef = this.dialog.open(ResetChangesComponent, {
          width: '250px',
          panelClass: this.dataservice.user.settings.darkmode ? 'dark' : '',
          data: {image: this.selectedImage, reset: false}
      });
      // After the popup is closed, this Method will be triggered
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.httpService.resetImageChanges(this.selectedImage.factoryTitle, this.selectedImage.owner).subscribe(res => {
                  if (res['status'] === 'success') {
                      this.isInfoOpen = false;
                      this.snackBar.open('Changes from ' + res['fileName'] + ' resetet');
                      setTimeout(() => this.snackBar.dismiss(), this.dataservice.settings.snackBarTimeout);
                  }
              });

          }
      });
    }

    // Moves the image to the trash
    deleteImage(image: Image): void {
        this.images = this.images.filter(i => i !== image);
    }

    // Opens the Grading-Page
    gradeImage() {
        this.dataservice.gradingImage = this.selectedImage;
        this.dataservice.navItems.forEach(i => {
            /* tslint:disable:no-string-literal */
            i['active'] = false;
            if (i['route'] === '/dashboard/grading') {
                i['active'] = true;
            }
            /* tslint:enable:no-string-literal */
        });
        this.router.navigate(['/dashboard/grading']);
    }

    // Filter function of the MetaList
    applyFilter(filterValue: string) {
        this.datasource.filter = filterValue.trim().toLowerCase();
    }

  previewimages(image) {
    return this.loadImage()
  }
  loadImage() {
      this.httpService.getThumbnail().subscribe(result => {
        this.createImageFromBlob(result);
      });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    this.img = reader.addEventListener('load', () => {
      this.img = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'social-sharing-sheet',
    templateUrl: 'socialSharingSheet.html',
    styleUrls: ['./my-media.component.scss']
})
export class SocialSharingSheetComponent {
    constructor(private socialSheetRef: MatBottomSheetRef<SocialSharingSheetComponent>) {
    }

    openLink(event: MouseEvent): void {
        this.socialSheetRef.dismiss();
        event.preventDefault();
    }
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'delete-dialog',
    templateUrl: 'delete-dialog.html',
})
export class DeleteDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ImageDelete) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'reset-changes',
    templateUrl: 'reset-changes.html',
})
export class ResetChangesComponent {

    constructor(
        public dialogRef: MatDialogRef<ResetChangesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ImageReset) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'download-dialog',
    templateUrl: 'download-dialog.html',
})
export class DownloadDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DownloadDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ImageDownload) {
    }


    onCancel(): void {
        this.dialogRef.close();
    }

}
