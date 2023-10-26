import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
         this.router.navigate(['/dashboard']);
       },
       (error) => {
         this.snackBar.open('Login Unsuccessful: Invalid credentials', '', {
          duration: 3000,
          panelClass: ['mat-snack-bar-error']
        });
       }
     );
   }
}
