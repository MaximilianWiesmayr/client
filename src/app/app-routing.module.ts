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
import {MyMediaComponent} from './components/client-area/my-media/my-media.component';
import {CreditsComponent} from './components/credits/credits.component';
import {VerifyComponent} from './components/verify/verify.component';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'}, // Later on the redirect is replaced by the Landingpage-Component
    {path: 'login', component: LoginComponent},
    {
        path: 'register', component: RegisterWrapperComponent, children: [
            {path: '', component: RegisterComponent},
            {path: 'success', component: MailSuccessComponent, canActivate: [AuthGuard]},
            {path: 'failed', component: MailFailedComponent, canActivate: [AuthGuard]},
            {path: '**', redirectTo: ''}
        ]
    },
    {path: 'verify', component: VerifyComponent},
    {path: 'dashboard', component: ClientAreaComponent, canActivate: [AuthGuard], children: [
            {path: '', component: DashboardComponent},
            {path: 'photos', component: MyMediaComponent}
        ]},
    {path: 'credits', component: CreditsComponent},
    {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
