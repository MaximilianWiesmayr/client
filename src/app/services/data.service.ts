import {EventEmitter, Injectable} from '@angular/core';
import {User} from '../entities/User';
import {Image} from '../entities/Image';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Receives a Value from App Component if the device is a Mobile device
  public isMobile: boolean = false;
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
  // The Settings Object let you change for instance the title of the whole project
  public settings = {
    title: 'InstantGrade',
    version: '1.0',
    virtualCurrency: 'Credits',
    snackBarTimeout: 3000, // 3 sek
    domain: 'http://instantgrade.bastiarts.com/'
  };
  // Sidebar Items
  public navItems: Array<object> = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      active: true
    },
    {
      title: 'Workspace', // My Photos
      icon: 'folder', // photo_library
      route: '/dashboard/photos',
      active: false
    },
    {
      title: 'Grade',
      icon: 'tune',
      route: '/dashboard/grading',
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
  // The dummyUser
  public user: User = new User();
  // Sidebar collapsing emitter
  public collapseEmitter: EventEmitter<boolean> = new EventEmitter();
  /** Emitter to refresh the dashboardstats eg. if Image got deleted, uploaded, ...*/
  public imageStatusEmitter: EventEmitter<Image> = new EventEmitter(true);
  // GradingImage
  public gradingImage: Image = new Image();
  // Prevent Routing while uploading
  public isUploading = false;

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

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.user = new User();
    this.gradingImage = new Image();

  }
}
