import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})

export class UserRegistrationComponent {
    // Define variables to store user input
    username: string = '';
    emailAddress: string = '';
    password: string = '';
    hidePassword: boolean = true;

    @ViewChild('form') form!: NgForm;
    
    constructor (private authService: AuthService, private router: Router, private snackBar : MatSnackBar) { }

    registerUser() {
      const user = new User(this.username, this.emailAddress, this.password);
        if(this.form && this.form.valid){
        this.authService.register(user).subscribe(
          (response)=> {
            console.log("Registration successful:",response);
            this.snackBar.open('Registration Successful', '', {
              duration: 3000,
            });
              // Navigate back to login page after a delay
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3100);
          },
          (error) => {
            console.log("Registration failed:",error);
            const errorMsg = error.error.message || 'Failed to register. Please try again later.';
            this.snackBar.open(errorMsg, '', {
              duration: 3200,
              panelClass: ['mat-snack-bar-error']
            });

          }
        );
        } else {
          console.log('Form is not valid');
        }
    }

}
