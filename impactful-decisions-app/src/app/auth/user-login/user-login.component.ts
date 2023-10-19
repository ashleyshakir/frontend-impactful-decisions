import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {

  emailAddress: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  loginUser(){
    // Create a login request object and pass it to your authService.login() method.
     const loginRequest = {
       emailAddress: this.emailAddress,
       password: this.password
     };
     this.authService.login(loginRequest).subscribe(
       (response)=> {
         console.log("Login successful:",response);
        //  this.router.navigate(['/dashboard']);
       },
       (error) => {
         console.log("Login failed:",error);
       }
     );
   }
}
