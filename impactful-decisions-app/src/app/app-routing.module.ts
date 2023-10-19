import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './auth/user-registration/user-registration.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';

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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
