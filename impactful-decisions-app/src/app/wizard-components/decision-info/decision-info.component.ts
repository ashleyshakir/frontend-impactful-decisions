import { Component, OnInit } from '@angular/core';
import { Decision } from 'src/app/models/decsion.model';
import { FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { Router, NavigationEnd } from '@angular/router';
import { FormService } from'src/app/services/form.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-decision-info',
  templateUrl: './decision-info.component.html',
  styleUrls: ['./decision-info.component.scss']
})
export class DecisionInfoComponent implements OnInit{

  private formValueChangesSubscription?: Subscription;
  step1Form!: FormGroup;
  decisionId!: number | null;

  constructor(private fb: FormBuilder, 
              private decisionService: DecisionService, 
              private router: Router,
              private formService: FormService) { 
    
    // this.router.events.subscribe((event) => {
    //   if(event instanceof NavigationEnd && event.url === '/dashboard') {
    //     this.unsubscribeFromFormChanges();
    //     this.decisionId = null;
    //     this.step1Form.reset();
    //     this.formService.clearFormData();
    //   }
    // })
  }

  ngOnInit(): void {
    // Subscribe to form data to get the decisionId
    this.formService.formData$.subscribe(data => {
      this.decisionId = data.decisionId;
      console.log("Decision ID on init: ", this.decisionId);
    });

    // Initialize the form
    this.step1Form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });

     // Load existing form data from the service
     this.formService.loadFormDataFromLocalStorage();
     const storedData = this.formService.getFormData();
     console.log("stored data: ", storedData)
     if (storedData && storedData.title && storedData.description) {
        this.step1Form.patchValue(storedData);
     } 

    if (this.decisionId){
    // Fetch existing data from API and populate form if needed
    this.decisionService.getDecisionDetails(this.decisionId).subscribe(data => {
      if (data){
        this.step1Form.patchValue(data.data);
      } 
    });

    // Listen for form changes and update the API
    // Capture the subscription object when subscribing
  //   this.formValueChangesSubscription = this.step1Form.valueChanges.pipe(
  //     debounceTime(400),  // Wait for 400ms pause in events
  //     distinctUntilChanged()  // Only send if value changed
  //   ).subscribe(decision => {
  //     decision.id = this.decisionId;
  //     this.decisionService.updateDecision(decision).subscribe(response => {
  //       console.log(response);
  //     });
  //   });
    } 
  }
  private unsubscribeFromFormChanges() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  onSave(): void {
    const titleControl = this.step1Form.get('title') as FormControl;
    if(this.step1Form.valid) {
      const decisionData : Decision = this.step1Form.value;
      if (this.decisionId){
        // Update the existing decision
        decisionData.id = this.decisionId;
        this.decisionService.updateDecision(decisionData).subscribe(response => {
          if (response && response.message === 'Decision updated successfully') {
            this.formService.updateFormData(decisionData);
            this.router.navigate(['/decisions/create/step2']);
          } else {
            console.log(response.message);
          }
        }, error => {
          console.log(error);
        });
      } else {
        // Create a new decision
        this.decisionService.createDecision(decisionData).subscribe(response => {
          if(response && response.message === "success, decision created") {
            this.formService.updateFormData(decisionData, response.data.id);
            this.decisionId = response.data.id;
            this.router.navigate(['/decisions/create/step2']);
          } else  {
            titleControl.setErrors({ 'serverError': response.message });
          }
        }, error => {
          console.log(error)
        });
      }

    } else {
      console.error('Form is not valid');
    }
  }
}
