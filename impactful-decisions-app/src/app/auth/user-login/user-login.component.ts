import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar
 } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {

  emailAddress: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private router: Router, private snackBar :MatSnackBar) { }

  loginUser(){
    // Create a login request object and pass it to your authService.login() method.
     const loginRequest = {
       emailAddress: this.emailAddress,
       password: this.password
     };
     this.authService.login(loginRequest).subscribe(
       (response)=> {
         console.log("Login successful:",response);
         this.router.navigate(['/dashboard']);
       },
       (error) => {
         console.log("Login failed:",error);
         this.snackBar.open('Login Unsuccessful: Invalid credentials', '', {
          duration: 3000,
          panelClass: ['mat-snack-bar-error']
        });
       }
     );
   }
}
