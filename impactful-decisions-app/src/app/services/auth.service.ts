import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9093';
  user: User | null = null; 
  public userLoggedOut: EventEmitter<void> = new EventEmitter<void>();


  constructor(private http : HttpClient) {
    this.initializeUserFromLocalStorage();
   }

  private initializeUserFromLocalStorage(): void {
    const token = this.getToken();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      this.user = user;
    }
  }
  

    // Store the JWT token in localStorage
    storeToken(token: string): void {
      localStorage.setItem('token', token);
     }
     storeUser(user: User): void {
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
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
          this.storeUser(response.user);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Returns true if the token is present, false otherwise
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');  
    this.user = null;
    this.userLoggedOut.emit();
  }

  register(user : User): Observable<any> {
    const url = `${this.baseUrl}/auth/users/register/`;
    return this.http.post(url, user).pipe(
      catchError((error)=> {
        return throwError(error);
      })
    )
  }


}
