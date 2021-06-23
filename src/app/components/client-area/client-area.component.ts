import {Component, OnInit, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {SubscriptionStatus} from '../../enums/subscription-status.enum';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface AcceptLogout {
    logout: boolean;
}

export interface SaveChanges {
    save: boolean;
}

@Component({
  selector: 'app-client-area',
  templateUrl: './client-area.component.html',
  styleUrls: ['./client-area.component.scss']
})
export class ClientAreaComponent implements OnInit {
  public actualDate: Date = new Date();

  constructor(public dataservice: DataService, public router: Router, public datePipe: DatePipe, public dialog: MatDialog) {
  }

  // Toggles the Sidebar
  toggleCollapse(collapsed?: boolean) {
    this.dataservice.user.settings.navBarCollapsed = collapsed !== undefined ?
      collapsed : !this.dataservice.user.settings.navBarCollapsed;
    if (document.getElementsByClassName('usernameAndCredits')[0] && document.getElementById('header')) {
      document.getElementsByClassName('usernameAndCredits')[0].getElementsByTagName('span')[0].innerText =
        this.dataservice.user.settings.navBarCollapsed ?
          this.dataservice.makeInitials() :
          this.dataservice.user.firstname + ' ' + this.dataservice.user.lastname;

      document.getElementById('header').innerText =
        this.dataservice.user.settings.navBarCollapsed ?
          this.dataservice.makeInitialsFromWord(this.dataservice.settings.title) :
          this.dataservice.settings.title;
    }
  }

  // Toggles the toggle icon
  toggleIcon(): string {
    if (this.dataservice.isMobile) {
      if (this.dataservice.user.settings.navBarCollapsed) {
        return 'close';
      } else {
        return 'menu';
      }
    } else if (this.dataservice.user.settings.navBarCollapsed) {
      return 'keyboard_arrow_right';
    } else {
      return 'keyboard_arrow_left';
    }
  }

  ngOnInit() {
    // Display the current subscription status of the user
    switch (this.dataservice.user.subscriptionStatus) {
      case SubscriptionStatus.BASIC:
        document.getElementById('accountType').hidden = true;
        break;
      case SubscriptionStatus.PRO:
        document.getElementById('accountType').innerHTML =
          '<span style="color: blueviolet; font-weight: bold; text-transform: uppercase;">' + SubscriptionStatus.PRO + '</span>';
        break;
      case SubscriptionStatus.EXPERT:
        document.getElementById('accountType').innerHTML =
          '<span style="color: goldenrod; font-weight: bold; text-transform: uppercase;">' + SubscriptionStatus.EXPERT +
          '</span>';
        break;
      default:
        document.getElementById('accountType').hidden = true;
        break;
    }
    // Switch the selection of the Sidebar-Navigation regarding the URL
    this.dataservice.navItems.forEach(n => {
      /* tslint:disable:no-string-literal */
      if (this.router.url.endsWith(n['route'])) {
        n['active'] = true;
      } else {
        n['active'] = false;
      }
      /* tslint:enable:no-string-literal */
    });
    this.dataservice.collapseEmitter.subscribe((res: boolean) => {
      this.toggleCollapse(res);
    });
  }

  performRouting(item) {
    if (this.dataservice.isMobile) {
      this.dataservice.user.settings.navBarCollapsed = false;
    }
    this.dataservice.navItems.forEach(i => {
      /* tslint:disable:no-string-literal */
      i['active'] = false;
      if (i === item) {
        i['active'] = true;
      }
      /* tslint:enable:no-string-literal */
    });
    if (item.title === 'Logout') {
      this.openLogoutDialog(item);
    }
    else{
      if(!this.dataservice.isUnsaved) {
        this.router.navigate([item.route]);
      } else {
        this.openSaveDialog(item);
      }
    }
  }

  openLogoutDialog(item): void {
      const dialogRef = this.dialog.open(LogoutDialogComponent, {
          width: '250px',
          panelClass: this.dataservice.user.settings.darkmode ? 'dark' : '',
          data: {logout: false}
      });
      // After the popup is closed, this Method will be triggered
      dialogRef.afterClosed().subscribe(result => {
            if(result) {
              this.dataservice.logout();
              this.dataservice.isUnsaved = false;
              this.router.navigate([item.route]);
            }
          }
      );
  }

  openSaveDialog(item): void {
      const dialogRef = this.dialog.open(SaveDialogComponent, {
          width: '350px',
          panelClass: this.dataservice.user.settings.darkmode ? 'dark' : '',
          data: {save: false}
      });
      // After the popup is closed, this Method will be triggered
      dialogRef.afterClosed().subscribe(result => {
            if(result) {
              this.dataservice.isUnsaved = false;
              this.router.navigate([item.route]);
            }
          }
      );
  }

}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'logout-dialog',
    templateUrl: 'logout-dialog.html',
})
export class LogoutDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<LogoutDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AcceptLogout) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'save-dialog',
    templateUrl: 'save-dialog.html',
})
export class SaveDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<SaveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SaveChanges) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
