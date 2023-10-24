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
  private formDataStore: any = {};

  constructor() { 
    // this.loadFormDataFromLocalStorage();
  }
  loadFormDataFromLocalStorage(): void {
    const storedData = JSON.parse(localStorage.getItem('form-data')|| '{}');
    if (storedData) {
      this.formData = storedData;
      this.formDataSubject.next(this.formData);
  }
}

updateFormData(newData: any, newDecisionId?: number): void {
  this.formData = { ...this.formData, ...newData };
  this.formDataStore = newData;
  if(newDecisionId) {
    this.formData.decisionId = newDecisionId;
  }
  console.log("Storing/Retrieving form data via FormService: ", this.formData);
  localStorage.setItem('form-data', JSON.stringify(this.formData));
  this.formDataSubject.next(this.formData);
}

getFormData(): any {
  console.log("Storing/Retrieving form data via FormService: ", this.formData);
  return this.formDataStore;

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
