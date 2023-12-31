import { Component, OnInit } from '@angular/core';
import { Decision } from 'src/app/models/decsion.model';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { Router } from '@angular/router';
import { FormService } from'src/app/services/form.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from 'src/app/dialog-components/welcome-dialog/welcome-dialog.component';

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
              private formService: FormService,
              public dialog: MatDialog) { 
  }

  ngOnInit(): void {

    // Subscribe to form data to get the decisionId for new decisions
    this.formService.formData$.subscribe(data => {
      // Only update the decisionId from the formService if it's not already set
      if (!this.decisionId){
        this.decisionId = data.decisionId;
      }
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
    } 
    if (!localStorage.getItem('welcomeDialog')) {
      this.openDialog();
    }
  }
  private unsubscribeFromFormChanges() {
    if (this.formValueChangesSubscription) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(WelcomeDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(() => {
      localStorage.setItem('welcomeDialog', 'true');
    });
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
          } 
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
        });
      }
    } 
  }
}
