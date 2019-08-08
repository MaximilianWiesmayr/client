import {Component, Inject, OnInit} from '@angular/core';
import {Image} from '../../../entities/Image';
import {ImageExtension} from '../../../enums/image-extension.enum';
import {DataService} from '../../../services/data.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    public images: Array<Image> = [
        new Image('TE', '20190411-DSCF0697', '/assets/', ImageExtension.JPG),
        new Image('TEST', '20190410-DSCF0620', '/assets/', ImageExtension.JPG), // ../../../../assets/
    ];
    // The currently selected Image (by clicking on it to open the Details)
    public selectedImage: Image;

    constructor(
        public dataservice: DataService,
        private socialSheet: MatBottomSheet,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
    }

    // Receive Media from our Back-End via REST
    loadMedia() {
    }

    // Opens the Info dialog for the clicked image
    openInfo(image: Image) {
        // Sets the opening indicator to true
        this.isInfoOpen = true;
        // Sets the current Image
        this.selectedImage = image;
        // Sets the background-image of the preview
        document.getElementById('imagePreview').style.backgroundImage =
            'url("' + image.path + image.factoryTitle + '.' + image.extension + '")';
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
                this.isInfoOpen = false;
                this.snackBar.open('Image successfully deleted.', 'Undo');
                // Method for restoring the previous deleted image
                this.snackBar._openedSnackBarRef.onAction().subscribe(() => {
                    // TODO IMAGE RESTORE HTTP REQUEST
                    this.images.push(this.selectedImage);
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
