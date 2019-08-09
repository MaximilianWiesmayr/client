import {Settings} from './Settings';
import {SubscriptionStatus} from '../enums/subscription-status.enum';
import {AccountType} from '../enums/account-type.enum';

export class User {
    constructor(
        public username: string = '',
        public firstname: string = '',
        public lastname: string = '',
        public email: string = '',
        public settings: Settings = new Settings(),
        public credits: number = 0,
        public subscriptionType: SubscriptionStatus = SubscriptionStatus.BASIC,
        public accountType: AccountType = AccountType.INACTIVE
    ) {
    }
}
