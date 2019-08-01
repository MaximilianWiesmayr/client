import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ClientAreaComponent} from './components/client-area/client-area.component';
import {DashboardComponent} from './components/client-area/dashboard/dashboard.component';
import {AuthGuard} from './services/auth.guard';
import {MailSuccessComponent} from './components/register/mail-success/mail-success.component';
import {RegisterWrapperComponent} from './components/register/register-wrapper/register-wrapper.component';
import {MailFailedComponent} from './components/register/mail-failed/mail-failed.component';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'}, // Later on the redirect is replaced by the Landingpage-Component
    {path: 'login', component: LoginComponent},
    {
        path: 'register', component: RegisterWrapperComponent, children: [
            {path: '', component: RegisterComponent},
            {path: 'success', component: MailSuccessComponent, canActivate: [AuthGuard]},
            {path: 'failed', component: MailFailedComponent},
            {path: '**', redirectTo: ''}
        ]
    },
    {path: 'dashboard', component: ClientAreaComponent, canActivate: [AuthGuard], children: [
            {path: '', component: DashboardComponent}
        ]},
    {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
