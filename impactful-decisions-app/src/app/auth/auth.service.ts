import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from './user.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:9093';
  user: User | null = null; // Initialize as null

    // Store the JWT token in localStorage
    storeToken(token: string): void {
      localStorage.setItem('token', token);
    }
  
    // Retrieve the JWT token from localStorage
    getToken(): string | null {
      return localStorage.getItem('token');
    }

  login(credentials : any) {
    const url = `${this.baseUrl}/auth/users/login/`;
    return this.http.post(url, credentials).pipe(
      tap((response: any) => {
        if (response && response.jwt) {
          // Store the JWT token in localStorage
          this.storeToken(response.jwt);

        // After storing the token, retrieve user information
        // this.getUserInformation().subscribe(
        //   (userData) => {
            // Create a User instance from the received user data
        //     this.user = new User(
        //       userData.username,
        //       userData.emailAddress,
        //       userData.password
        //     );
        //   },
        //   (error) => {
        //     console.error('Error retrieving user information:', error);
        //   }
        // );
        }
      })
    );
  }
}
