import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[appDragNDrop]'
})
export class DragNDropDirective {

    // tslint:disable-next-line:no-output-on-prefix
    @Output() onFileDropped = new EventEmitter<any>();
    @HostBinding('style.background-color') private background = 'transparent';
    @HostBinding('style.opacity') private opacity = '1';

    constructor() {
    }

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = '#ffe0b3';
        this.opacity = '0.8';
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event'])
    public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = 'transparent';
        this.opacity = '1';
    }

    // Drop listener
    @HostListener('drop', ['$event'])
    public ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = 'transparent';
        this.opacity = '1';
        const files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.onFileDropped.emit(files);
        }
    }

}
