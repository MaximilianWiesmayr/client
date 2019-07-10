import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ClientAreaComponent} from './components/client-area/client-area.component';
import {DashboardComponent} from './components/client-area/dashboard/dashboard.component';
import {AuthGuard} from './services/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'}, // Later on the redirect is replaced by the Landingpage-Component
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: ClientAreaComponent, canActivate: [AuthGuard], children: [
            {path: '', component: DashboardComponent}
        ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
