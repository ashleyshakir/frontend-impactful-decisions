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
import { Criteria } from '../models/criteria.model';

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
  
  totalDecisions(decisions: Decision[]) : number{
    return decisions.length;
  }

  // Logic for getting the percentages of the decisions that have been resolved
  resolvedPercentage(decisions :Decision[]): number{
    const decisionCount = decisions.length;
    const resolvedCount = decisions.filter(decision => decision.resolved).length;
    return Math.floor(resolvedCount / decisionCount * 100);
  }

  // Request to CREATE, GET, UPDATE, DELETE a decision
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
  getDecisions() : Observable<{ data: Decision[]}>{
    return this.http.get<{data : Decision[] }>(this.decsionsUrl,{headers: this.headers});
  }
  getDecisionDetails(decisionId: number): Observable<{data: Decision}>{
    const url = `${this.decsionsUrl}${decisionId}/`;
      return this.http.get<{data: Decision}>(url, {headers: this.headers}).pipe(
        tap(response => {
          console.log(response.data);
        })
      )
  }
  updateDecision(decision: Decision): Observable<any> {
    return this.http.put(this.decsionsUrl + decision.id + "/", decision, {headers: this.headers}).pipe(
      tap((response : any)=> {
        if (response && response.data){
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



  // Request to CREATE, GET, UPDATE, and DELETE Options
  addOptionsToDecision(options: any[]): Observable<any> {
    const url = `${this.decsionsUrl}${this.decisionId}/options/`;
    return this.http.post(url, options, {headers: this.headers});
  }
  getDecisionOptions(decisionId: number): Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${decisionId}/options/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers}).pipe(
      tap((response) => {
        console.log(response);
      })
    )
  }
  updateOptions(decisionId: number, optionId: number, option: Option): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/`;
    return this.http.put(url, option, {headers: this.headers});
  }
  deleteOption(decisionId: number, optionId: number): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/`;
    return this.http.delete(url, {headers: this.headers});
  }
  
  // Request to CREATE, GET, UPDATE, and DELETE Criteria
  addCriteriaToDecision(criteria: any[]): Observable<any> {
    const url = `${this.decsionsUrl}${this.decisionId}/criteria/`;
    return this.http.post(url, criteria, {headers: this.headers});
  }
  getDecisionCriteria(decisionId: number): Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers}).pipe(
      tap((response) => {
        console.log(response);
      })
    )
  }
  updateCriteria(decisionId: number, criteriaId: number, criteria: Criteria): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/${criteriaId}/`;
    return this.http.put(url, criteria, {headers: this.headers});
  }
  deleteCriteria(decisionId: number, criteriaId: number): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/${criteriaId}/`;
    return this.http.delete(url, {headers: this.headers});
  }

  addProConToOption(decisionId: number, optionId: number, proConData: ProCon, criteriaName: string): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/procons/?criteriaName=${criteriaName}`;
    return this.http.post(url, proConData, {headers: this.headers});
  }

  // Request to Analyze a Decision and recieve a Recommended Option
  analyzeDecision(): Observable<any> {
    const url = `${this.decsionsUrl}${this.decisionId}/recommendation/`;
    return this.http.get<any>(url, {headers: this.headers}).pipe(
      tap((response) => {
        console.log(response);
      })
    )
  }
}
