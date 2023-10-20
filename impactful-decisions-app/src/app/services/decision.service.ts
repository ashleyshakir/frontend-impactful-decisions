import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Decision } from '../models/decsion.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DecisionService {

  private baseUrl = 'http://localhost:9093';
  private decsionsUrl = `${this.baseUrl}/api/decisions/`;
  
  decisions: Decision[] = [];
  decision : Decision | null = null; // Initialize as null
  jwtToken = this.authService.getToken();
  headers = {
    Authorization: `Bearer ${this.jwtToken}`
  }

  constructor(private http : HttpClient, private authService :AuthService) { }


  getDecisions() : Observable<{ data: Decision[]}>{
    return this.http.get<{data : Decision[] }>(this.decsionsUrl,{headers: this.headers}).pipe(
      tap((response) => {
        console.log("Response: ", response.data);
        this.decisions = response.data;
      })
    );
  }

}
