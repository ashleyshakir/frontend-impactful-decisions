import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './auth/user-registration/user-registration.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { DashboardContainerComponent } from './dashboard/dashboard-container/dashboard-container.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  {
    path: '', 
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'register', 
    component: UserRegistrationComponent
  },
  {
    path: 'login', 
    component: UserLoginComponent
  },
  {
    path: 'dashboard', 
    component: DashboardContainerComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
