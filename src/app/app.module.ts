import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './modules/material/material.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {ClientAreaComponent} from './components/client-area/client-area.component';
import {LoginComponent} from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/client-area/dashboard/dashboard.component';
import {AuthGuard} from './services/auth.guard';

@NgModule({
    declarations: [
        AppComponent,
        ClientAreaComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
