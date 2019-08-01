import {Settings} from './Settings';

export class User {
    constructor(
        public username: string = '',
        public firstname: string = '',
        public lastname: string = '',
        public email: string = '',
        public settings: Settings = new Settings(),
        public credits: number = 0
    ) {
    }
}
