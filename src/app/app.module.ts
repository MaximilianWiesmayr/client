import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
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
import {DeleteDialogComponent, MyMediaComponent, SocialSharingSheetComponent} from './components/client-area/my-media/my-media.component';
import {GestureConfig, MatBottomSheetModule, MatDialogModule} from '@angular/material';
import {CreditsComponent} from './components/credits/credits.component';
import {VerifyComponent} from './components/verify/verify.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpService} from './services/http.service';
import {AuthInterceptor} from './util/interceptors/auth-interceptor';
import {DragNDropDirective} from './directives/drag-n-drop.directive';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {GradingComponent} from './components/client-area/grading/grading.component';
import {MouseWheelDirective} from './directives/mousewheel.directive';
import {LazyLoadDirective} from './directives/lazy-load.directive';
import {BrowseComponent} from './components/client-area/browse/browse.component';
import {BrowseItemComponent} from './components/client-area/browse/browse-item/browse-item.component';
import {DatePipe} from '@angular/common';

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
    DeleteDialogComponent,
    CreditsComponent,
    VerifyComponent,
    FileUploadComponent,
    GradingComponent,
    DragNDropDirective,
    MouseWheelDirective,
    LazyLoadDirective,
    BrowseComponent,
    BrowseItemComponent
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
    MatBottomSheetModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [AuthGuard, HttpService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    DatePipe,
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}],
  bootstrap: [AppComponent],
  entryComponents: [SocialSharingSheetComponent, DeleteDialogComponent]
})
export class AppModule {
}
