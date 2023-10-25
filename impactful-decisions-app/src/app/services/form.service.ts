import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private formData: any = {
    decision: null,
    options: [],
    criteria: [],
    procons: [],
  }
  private formDataSubject = new BehaviorSubject<any>(this.formData);
  formData$ = this.formDataSubject.asObservable();

  constructor() { }
  
  loadFormDataFromLocalStorage(): void {
    const storedData = JSON.parse(localStorage.getItem('form-data')|| '{}');
    if (storedData) {
      this.formData = storedData;
      this.formDataSubject.next(this.formData);
  }
}

updateFormData(newData: any, newDecisionId?: number): void {
  this.formData = { ...this.formData, ...newData };
  if(newDecisionId) {
    this.formData.decisionId = newDecisionId;
  }
  localStorage.setItem('form-data', JSON.stringify(this.formData));
  this.formDataSubject.next(this.formData);
}

getFormData(): any {
  return this.formData;
}

clearFormData(): void {
  this.formData = {
    decision: null,
    options: [],
    criteria: [],
    procons: [],
    decisionId: null
  };
  localStorage.removeItem('form-data');
  this.formDataSubject.next(this.formData);
}


}
