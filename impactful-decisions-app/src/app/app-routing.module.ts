import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './auth-components/user-registration/user-registration.component';
import { UserLoginComponent } from './auth-components/user-login/user-login.component';
import { DashboardContainerComponent } from './dashboard-components/dashboard-container/dashboard-container.component';
import { AuthGuard } from './services/auth-guard';
import { AllDecisionsComponent } from './dashboard-components/side-nav-components/all-decisions/all-decisions.component';

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
  },
  {
    path: 'dashboard/decisions',
    component: AllDecisionsComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
