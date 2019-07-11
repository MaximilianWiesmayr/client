import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MailSuccessComponent} from './mail-success.component';

describe('MailSuccessComponent', () => {
    let component: MailSuccessComponent;
    let fixture: ComponentFixture<MailSuccessComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MailSuccessComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MailSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
