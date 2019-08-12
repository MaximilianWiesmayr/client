import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {SubscriptionStatus} from '../../enums/subscription-status.enum';

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
            route: '/dashboard',
            active: true
        },
        {
            title: 'My Photos',
            icon: 'folder', // photo_library
            route: '/dashboard/photos',
            active: false
        },
        {
            title: 'Browse',
            icon: 'cloud_circle',
            route: '/browse',
            active: false
        },
        {
            title: 'Logout',
            icon: 'logout',
            route: '/logout',
            active: false
        }
    ];

    constructor(public dataservice: DataService, public router: Router) {
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
        this.navItems.forEach(n => {
            /* tslint:disable:no-string-literal */
            if (this.router.url.endsWith(n['route'])) {
                n['active'] = true;
            } else {
                n['active'] = false;
            }
            /* tslint:enable:no-string-literal */
        });
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
        if (item.title === 'Logout') {
            this.dataservice.reset();
        }
        this.router.navigate([item.route]);
    }
}
