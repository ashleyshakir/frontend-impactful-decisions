import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Decision } from '../models/decsion.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProCon } from '../models/procon.model';
import { Option } from '../models/option.model';

@Injectable({
  providedIn: 'root'
})

export class DecisionService {

  private baseUrl = 'http://localhost:9093';
  private decsionsUrl = `${this.baseUrl}/api/decisions/`;
  
  decisions: Decision[] = [];
  options: any[] = [];
  criteria: any[] = [];
  decision : Decision | null = null; 
  decisionId : number | null = null;

  constructor(private http : HttpClient, private authService :AuthService) { 
    this.authService.userLoggedOut.subscribe(() => {
      this.resetDecisionData();  // This method clears out the decision data
    });
  }
  get headers() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  }

  private handleError(error: any){
    let errorMessage= '';
    if(error.error instanceof ErrorEvent){
      // Get client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else  {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    return throwError(errorMessage);
  }

  resetDecisionData() {
    this.decisions = [];
    this.decision = null;
    this.decisionId = null;
    localStorage.removeItem('decision');
  }
  
  getDecisions() : Observable<{ data: Decision[]}>{
    return this.http.get<{data : Decision[] }>(this.decsionsUrl,{headers: this.headers});
  }

  totalDecisions(decisions: Decision[]) : number{
    return decisions.length;
  }

  resolvedPercentage(decisions :Decision[]): number{
    const decisionCount = decisions.length;
    const resolvedCount = decisions.filter(decision => decision.resolved).length;
    return Math.floor(resolvedCount / decisionCount * 100);
  }

  createDecision(decision: Decision): Observable<any> {
    return this.http.post(this.decsionsUrl, decision, {headers: this.headers}).pipe(
      tap((response : any)=> {
        if (response && response.data){
            // this.storeDecision(response.data);
            this.decisionId = response.data.id;
        }
      }),
      catchError(this.handleError)
    )
  }
  updateDecision(decision: Decision): Observable<any> {
    return this.http.put(this.decsionsUrl + decision.id + "/", decision, {headers: this.headers}).pipe(
      tap((response : any)=> {
        if (response && response.data){
            // this.storeDecision(response.data);
        }
      }),
      catchError(this.handleError)
    )
  }
  deleteDecision(decisionId: number): Observable<any> {
    return this.http.delete(this.decsionsUrl + decisionId + "/", {headers: this.headers}).pipe(
      tap((response : any)=> {
        if (response && response.data){
            // this.storeDecision(response.data);
        }
      }),
      catchError(this.handleError)
    )
  }

  // getDecisionById(): Observable<{data: Decision}>{
  //   const url = `${this.decsionsUrl}${this.decisionId}/`;
  //   return this.http.get<{data : Decision}>(url, {headers: this.headers}).pipe(
  //     tap(response => {
  //       console.log(response.data);
  //     })
  //   )
  // }

  getDecisionDetails(decisionId: number): Observable<{data: Decision}>{
    const url = `${this.decsionsUrl}${decisionId}/`;
      return this.http.get<{data: Decision}>(url, {headers: this.headers}).pipe(
        tap(response => {
          console.log(response.data);
        })
      )
  }

  // storeDecision(decision: Decision): void {
  //   console.log("Storing decision via storeDecision: ", decision);
  //   localStorage.setItem('decision', JSON.stringify(decision));
  //   this.decision = decision;
  // }

  addOptionsToDecision(options: any[]): Observable<any> {
    const url = `${this.decsionsUrl}${this.decisionId}/options/`;
    return this.http.post(url, options, {headers: this.headers});
  }
  updateOptions(decisionId: number, optionId: number, option: Option): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/`;
    return this.http.put(url, option, {headers: this.headers});
  }
  deleteOption(decisionId: number, optionId: number): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/`;
    return this.http.delete(url, {headers: this.headers});
  }
  
  addCriteriaToDecision(criteria: any[]): Observable<any> {
    const url = `${this.decsionsUrl}${this.decisionId}/criteria/`;
    return this.http.post(url, criteria, {headers: this.headers});
  }

  getDecisionOptions(decisionId: number): Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${decisionId}/options/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers}).pipe(
      tap((response) => {
        console.log(response);
        // this.options = response.data;
      })
    )
  }

  getDecisionCriteria(): Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${this.decisionId}/criteria/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers}).pipe(
      tap((response) => {
        console.log(response);
        // this.criteria = response.data;
      })
    )
  }

  addProConToOption(decisionId: number, optionId: number, proConData: ProCon, criteriaName: string): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/procons/?criteriaName=${criteriaName}`;
    return this.http.post(url, proConData, {headers: this.headers});
  }

  analyzeDecision(): Observable<any> {
    const url = `${this.decsionsUrl}${this.decisionId}/recommendation/`;
    return this.http.get<any>(url, {headers: this.headers}).pipe(
      tap((response) => {
        console.log(response);
      })
    )
  }



}
