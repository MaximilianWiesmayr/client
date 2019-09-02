import {Component, Inject, OnInit} from '@angular/core';
import {Image} from '../../../entities/Image';
import {DataService} from '../../../services/data.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpService} from '../../../services/http.service';
import {environment} from '../../../../environments/environment';

// Interface for our deletion - popup
export interface ImageDelete {
    delete: boolean;
    image: Image;
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
    // TODO HTTP Request
    public images: Array<Image> = [];
    // The currently selected Image (by clicking on it to open the Details)
    public selectedImage: Image;
    // UploadDomain
    public uploadDomain: string = environment.publicDomain;

    constructor(
        public dataservice: DataService,
        private httpService: HttpService,
        private socialSheet: MatBottomSheet,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        this.loadMedia();
    }

    // Receive Media from our Back-End via REST
    loadMedia() {
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

    // Opens the Info dialog for the clicked image
    openInfo(image: Image) {
        const meta: object = JSON.parse(image.metadata);
        // Sets the opening indicator to true
        this.isInfoOpen = true;
        // Sets the current Image
        this.selectedImage = image;
        // Sets the background-image of the preview
        document.getElementById('imagePreview').style.backgroundImage =
            'url("' + this.uploadDomain + '/' + image.path + '")';
    }

    // Opens the Bottom sheet to share the image on Social Media
    openSharingFeed(): void {
        this.socialSheet.open(SocialSharingSheetComponent, {
            panelClass: this.dataservice.user.settings.darkmode ? 'dark' : ''
        });
    }

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

    deleteImage(image: Image): void {
        // TODO IMAGE DELETE REQUEST
        this.images = this.images.filter(i => i !== image);
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
