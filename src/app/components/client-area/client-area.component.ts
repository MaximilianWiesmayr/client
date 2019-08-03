import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AccountType} from '../../enums/account-type.enum';

@Component({
    selector: 'app-client-area',
    templateUrl: './client-area.component.html',
    styleUrls: ['./client-area.component.scss']
})
export class ClientAreaComponent implements OnInit {
    public navItems: Array<object> = [
        {
            title: 'Dashboard',
            icon: 'dashboard',
            route: '',
            active: true
        },
        {
            title: 'My Photos',
            icon: 'folder', // photo_library
            route: '',
            active: false
        },
        {
            title: 'Browse',
            icon: 'cloud_circle',
            route: '',
            active: false
        },
        {
            title: 'Logout',
            icon: 'logout',
            route: '',
            active: false
        }
    ];

    constructor(public dataservice: DataService) {
    }

    // Toggles the Sidebar
    toggleCollapse() {
        this.dataservice.user.settings.navBarCollapsed = !this.dataservice.user.settings.navBarCollapsed;
        document.getElementsByClassName('usernameAndCredits')[0].getElementsByTagName('span')[0].innerText =
            this.dataservice.user.settings.navBarCollapsed ?
                this.dataservice.makeInitials() :
                this.dataservice.user.firstname + ' ' + this.dataservice.user.lastname;
        document.getElementById('header').innerText =
            this.dataservice.user.settings.navBarCollapsed ?
                this.dataservice.makeInitialsFromWord(this.dataservice.settings.title) :
                this.dataservice.settings.title;
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
        switch (this.dataservice.user.accountType) {
            case AccountType.BASIC:
                document.getElementById('accountType').hidden = true;
                break;
            case AccountType.PRO:
                document.getElementById('accountType').innerHTML =
                    '<span style="color: blueviolet; font-weight: bold; text-transform: uppercase;">' + AccountType.PRO + '</span>';
                break;
            case AccountType.EXPERT:
                document.getElementById('accountType').innerHTML =
                    '<span style="color: goldenrod; font-weight: bold; text-transform: uppercase;">' + AccountType.EXPERT + '</span>';
                break;
            default:
                document.getElementById('accountType').hidden = true;
                break;
        }
    }

    performRouting(item) {
        if (this.dataservice.isMobile) {
            this.dataservice.user.settings.navBarCollapsed = false;
        }
        this.navItems.forEach(i => {
            /* tslint:disable:no-string-literal */
            i['active'] = false;
            if (i === item) {
                i['active'] = true;
            }
            /* tslint:enable:no-string-literal */
        });
        // this.router.navigate([item.route]);
        // ROUTE HERE
    }
}
