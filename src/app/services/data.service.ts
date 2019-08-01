import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {
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
    // The Settings Object let you change for instance the title of the whole project
    public settings: object = {
        title: 'InstantGrade',
        version: '1.0',
        virtualCurrency: 'Credits',
        navBarCollapsed: false
    };

    constructor() {
    }
}
