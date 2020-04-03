export class Image {
    constructor(
      public title: string = '', // custom title set by the user, by default its the factory name
      public factoryTitle: string = '', // DSG00151 bla bla
      public path: string = '', // Storage Path
      public thumbnailPath?: string,
      public metadata: string = '',
      public owner: string = '',
    ) {
    }
}
