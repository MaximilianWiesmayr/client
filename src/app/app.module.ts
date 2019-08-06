import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './modules/material/material.module';
import {AppRoutingModule} from './app-routing.module';
import {ParticlesModule} from 'angular-particle';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {ClientAreaComponent} from './components/client-area/client-area.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {DashboardComponent} from './components/client-area/dashboard/dashboard.component';
import {AuthGuard} from './services/auth.guard';
import {MailSuccessComponent} from './components/register/mail-success/mail-success.component';
import {RegisterWrapperComponent} from './components/register/register-wrapper/register-wrapper.component';
import {MailFailedComponent} from './components/register/mail-failed/mail-failed.component';
import {MatPasswordStrengthModule} from '@angular-material-extensions/password-strength';
import {LoadingScreenComponent} from './components/loading-screen/loading-screen.component';
import {OverviewItemComponent} from './components/client-area/dashboard/overview-item/overview-item.component';
import {MyMediaComponent, SocialSharingSheetComponent} from './components/client-area/my-media/my-media.component';
import {MatBottomSheetModule} from '@angular/material';
import {CreditsComponent} from './components/credits/credits.component';

@NgModule({
    declarations: [
        AppComponent,
        ClientAreaComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        MailSuccessComponent,
        RegisterWrapperComponent,
        MailFailedComponent,
        LoadingScreenComponent,
        OverviewItemComponent,
        MyMediaComponent,
        SocialSharingSheetComponent,
        CreditsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        ParticlesModule,
        MatPasswordStrengthModule,
        MatBottomSheetModule
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent],
    entryComponents: [SocialSharingSheetComponent]
})
export class AppModule {
}
