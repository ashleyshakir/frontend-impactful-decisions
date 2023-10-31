import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Decision } from '../models/decsion.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProConItem } from '../models/procon.model';
import { Option } from '../models/option.model';
import { Criteria } from '../models/criteria.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DecisionService {

  private baseUrl = 'https://impactful-decisions-1be60030a140.herokuapp.com';
  private decsionsUrl = `${this.baseUrl}/api/decisions/`;
  
  // for updating decision stats once a user deletes a decision
  public decisionsChanged = new Subject<void>();
  
  decisions: Decision[] = [];
  options: any[] = [];
  criteria: any[] = [];
  decision : Decision | null = null; 

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
    // this.decisionId = null;
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
      catchError(this.handleError)
    );
  }

  getDecisions() : Observable<{ data: Decision[]}>{
    return this.http.get<{data : Decision[] }>(this.decsionsUrl,{headers: this.headers});
  }

  getDecisionDetails(decisionId: number): Observable<{data: Decision}>{
    const url = `${this.decsionsUrl}${decisionId}/`;
      return this.http.get<{data: Decision}>(url, {headers: this.headers});
  }
  updateDecision(decision: Decision): Observable<any> {
    return this.http.put(this.decsionsUrl + decision.id + "/", decision, {headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }
  deleteDecision(decisionId: number): Observable<any> {
    return this.http.delete(this.decsionsUrl + decisionId + "/", {headers: this.headers}).pipe(
      catchError(this.handleError)
    );
  }



  // Request to CREATE, GET, UPDATE, and DELETE Options
  addOptionsToDecision(decisionId: number, options: any[]): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/`;
    return this.http.post(url, options, {headers: this.headers});
  }
  getDecisionOptions(decisionId: number): Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${decisionId}/options/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers});
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
  addCriteriaToDecision(decisionId: number, criteria: any[]): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/`;
    return this.http.post(url, criteria, {headers: this.headers});
  }
  getDecisionCriteria(decisionId: number): Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers});
  }
  updateCriteria(decisionId: number, criteriaId: number, criteria: Criteria): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/${criteriaId}/`;
    return this.http.put(url, criteria, {headers: this.headers});
  }
  deleteCriteria(decisionId: number, criteriaId: number): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/criteria/${criteriaId}/`;
    return this.http.delete(url, {headers: this.headers});
  }
  
  // Request to CREATE, GET, UPDATE, and DELETE Pros and Cons
  addProConToOption(decisionId: number, optionId: number, proConData: ProConItem, criteriaName: string): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/procons/?criteriaName=${criteriaName}`;
    return this.http.post(url, proConData, {headers: this.headers});
  }

  getProsAndConsForOption(decisionId: number, optionId: number) : Observable<{data: any[]}> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/procons/`;
    return this.http.get<{data : any[]}>(url, {headers: this.headers});
  }

  updateProCon(decisionId: number, optionId: number, proConId: number, proCon: ProConItem, criteriaName: string) : Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/procons/${proConId}/?criteriaName=${criteriaName}`
    return this.http.put(url, proCon, {headers: this.headers});
  }

  deleteProCon(decisionId: number, optionId: number, proConId: number): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/options/${optionId}/procons/${proConId}`
    return this.http.delete(url, {headers: this.headers});
  }





  // Request to Analyze a Decision and recieve a Recommended Option
  analyzeDecision(decisionId: number): Observable<any> {
    const url = `${this.decsionsUrl}${decisionId}/recommendation/`;
    return this.http.get<any>(url, {headers: this.headers});
  }
}
