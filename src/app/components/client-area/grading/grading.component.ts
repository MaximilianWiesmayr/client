import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';

@Component({
    selector: 'app-grading',
    templateUrl: './grading.component.html',
    styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {

    settings: Array<object> = [
        {
            category: 'Levels',
            children: [
                {
                    title: 'Exposure',
                    min: -5,
                    max: 5,
                    step: 0.1
                },
                {
                    title: 'Contrast',
                    min: -100,
                    max: 100,
                    step: 1
                },
                {
                    title: 'Lights',
                    min: -100,
                    max: 100,
                    step: 1
                },
                {
                    title: 'Depths',
                    min: -100,
                    max: 100,
                    step: 1
                },
                {
                    title: 'White',
                    min: -100,
                    max: 100,
                    step: 1
                },
                {
                    title: 'Black',
                    min: -100,
                    max: 100,
                    step: 1
                }
            ]
        }
    ];

    constructor(public dataservice: DataService) {
    }

    ngOnInit() {
        this.dataservice.collapseEmitter.emit(true);
    }

    makeChanges(setting: string, value: number) {
        console.log(setting + ' > ' + value);
    }
}
