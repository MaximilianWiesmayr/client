# InstantGradeClient

Frontend by [Sebastian Schiefermayr](https://bastiarts.com) and [Maximilian Wiesmayr](https://github.com/MaximilianWiesmayr)

## Entities

<details>
<summary>User</summary>

```typescript
export class User {
    constructor(
        public username: string = '',
        public firstname: string = '',
        public lastname: string = '',
        public email: string = '',
        public password: string = '',
        public settings: Settings = new Settings(),
        public credits: number = 0,
        public subscriptionStatus: SubscriptionStatus = SubscriptionStatus.BASIC,
        public accountType: AccountType = AccountType.NOT_VERIFIED,
        public authToken?: string
    ) {
    }
}
```
</details>

<details>
<summary>Settings</summary>

```typescript
export class Settings {
    constructor(
        public darkmode: boolean = false,
        public navBarCollapsed: boolean = false,
        public myPhotosGridView: boolean = true
    ) {
    }
}
```
</details>

<details>
<summary>Image</summary>

```typescript
export class Image {
    constructor(
        public title: string = '', // custom title set by the user, by default its the factory name
        public factoryTitle: string = '', // DSG00151 bla bla
        public path: string = '', // Storage Path
        public extension: ImageExtension = ImageExtension.JPG, // ImageExtension
        public fileSize: string = '0 MB'

    ) {
    }
}
```
</details>

## Additional Informations

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.3.
