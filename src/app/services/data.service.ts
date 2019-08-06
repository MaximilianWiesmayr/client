import {Injectable} from '@angular/core';
import {User} from '../entities/User';
import {Settings} from '../entities/Settings';
import {AccountType} from '../enums/account-type.enum';
import {DashboardInfoItem} from '../entities/dashboard-info-item';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    // Receives a Value from App Component if the device is a Mobile device
    public isMobile: boolean = false;
    // Toggles the darkmode on the Page, later on it will replaced by the Userconfiguration
    public darkmode = false;
    // Settings for the particles on the Login & Register Page
    public particles: object = {
        style: {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'z-index': 1,
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0
        },
        params: {
            particles: {
                number: {
                    value: 100,
                },
                color: {
                    value: '#ff0000'
                },
                shape: {
                    type: 'circle'
                },
                line_linked: {
                    enable: false
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: false,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: false,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 200,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 200,
                            size: 80,
                            duration: 0.4
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    },
                    mouse: {}
                }
            }
        },
        width: 100,
        height: 100
    };
    // The dummyUser
    public user: User = new User(
        'BastiArts',
        'Sebastian',
        'Schiefermayr',
        'basti@bastiarts.com',
        new Settings(true, false),
        25000,
        AccountType.PRO);
    // The Settings Object let you change for instance the title of the whole project
    public settings = {
        title: 'InstantGrade',
        version: '1.0',
        virtualCurrency: 'Credits',
        dashboardOverviewItems: [
            new DashboardInfoItem(
                'photo',
                'Photos',
                '20'
            ),
            new DashboardInfoItem(
                'storage',
                'Space available',
                '12GB / 15GB'
            ),
            new DashboardInfoItem(
                'account_box',
                'Current Subscription',
                '<span class = "' + this.user.accountType.toString() + '">' + this.user.accountType.toString() + '</span>'
            ),
            new DashboardInfoItem(
                'notification_important',
                'Notifications',
                '0'
            )

        ]
    };

    constructor() {
    }

    // Method for making the initials of the Name
    makeInitials(): string {
        return this.user.firstname.charAt(0) + this.user.lastname.charAt(0);
    }

    // Method for making initials out of one word like InstantGrade
    makeInitialsFromWord(word: string): string {
        return word.replace(/[^A-Z]/g, '');
    }

}
