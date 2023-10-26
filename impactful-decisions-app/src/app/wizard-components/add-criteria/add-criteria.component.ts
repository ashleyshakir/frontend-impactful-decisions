import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidationErrors } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { FormService } from 'src/app/services/form.service';
import { Subscription } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Criteria } from 'src/app/models/criteria.model';
import { MatDialog } from '@angular/material/dialog';
import { CriteriaDialogComponent } from 'src/app/dialog-components/criteria-dialog/criteria-dialog.component';
@Component({
  selector: 'app-add-criteria',
  templateUrl: './add-criteria.component.html',
  styleUrls: ['./add-criteria.component.scss']
})
export class AddCriteriaComponent implements OnInit, OnDestroy{
  private subscription!: Subscription;
  criteriaForm!: FormGroup;
  decisionId!: number | null;
  originalCriteria: Criteria[] = [];
  isNewDecision: boolean = true;

  constructor(private fb: FormBuilder,
              private decisionService: DecisionService, 
              private formService : FormService, 
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    // Subscribe to form data to get the decisionId
    this.formService.formData$.subscribe(data => {
      this.decisionId = data.decisionId;
    });

    // Initialize the form
    this.criteriaForm = this.fb.group({
    criteria : this.fb.array([this.createCriteria()
    ], this.validateTotalWeight.bind(this))
    
    });

    // Load existing form data from the service
    this.formService.loadFormDataFromLocalStorage();
    console.log("Data loaded from local storage: ", this.formService.loadFormDataFromLocalStorage())


    this.subscription = this.formService.formData$.subscribe(formData => {
      if (this.decisionId) {
        this.handleExistingDecision(this.decisionId);
      } else {
        this.handleNewDecision(formData);
      }
    });

    if (!localStorage.getItem('criteriaDialog')) {
      this.openDialog();
    }

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CriteriaDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(() => {
      localStorage.setItem('criteriaDialog', 'true');
    });
  }

  private clearExistingCriteria(): void {
    while (this.criteria.length) {
      this.criteria.removeAt(0);
    }
  }
  private addCriteriaToForm(criteria: any[]): void {
    criteria.forEach((criterion: any) => {
      this.criteria.push(this.createCriteria(criterion.name, criterion.weight));
    });
  }
  private handleNewDecision(formData: any): void {
    if (formData && formData.criteria && Array.isArray(formData.criteria)) {
      this.clearExistingCriteria();
      this.addCriteriaToForm(formData.criteria);
    }
  }
  private handleExistingDecision(decisionId: number): void {
    this.decisionService.getDecisionCriteria(decisionId).subscribe(response => {
      if (response.data && Array.isArray(response.data)) {
        this.isNewDecision = false;
        this.clearExistingCriteria();
        this.originalCriteria =  [...response.data];
        this.addCriteriaToForm(response.data);
      }
    });
  }

  createCriteria(name: string = '', weight: number = 50): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      weight: [weight, [Validators.required, Validators.min(10), Validators.max(100)]]
    });
  }
  
  // Custom validator for the FormArray
  validateTotalWeight(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    const totalWeight = formArray.controls
      .map(ctrl => +ctrl.get('weight')?.value)
      .reduce((acc, value) => acc + value, 0);
  
    return totalWeight === 100 ? null : { totalWeightInvalid: true };
  }

  get totalWeight(): number {
    return this.criteria.controls
      .map(control => +control.get('weight')?.value || 0)
      .reduce((acc, value) => acc + value, 0);
  }

  get totalWeightInvalid() {
    return this.criteria.hasError('totalWeightInvalid');
  }

  get criteria(): FormArray {
    return this.criteriaForm.get('criteria') as FormArray;
  }

  get criteriaControls(): FormGroup[] {
    return (this.criteriaForm.get('criteria') as FormArray).controls as FormGroup[];
  }


  addCriteria(): void {
    const criteriaGroup = this.fb.group({
    name: ['', Validators.required],
    weight: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
  });

    this.criteria.push(criteriaGroup);
    this.criteria.updateValueAndValidity();

  }

  removeCriteria(index: number): void {
    this.criteria.removeAt(index);
    this.criteria.updateValueAndValidity();
    this.decisionService.deleteCriteria(this.decisionId!, this.originalCriteria[index].id!).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

   /**
  * Handles saving form changes to criteria.
  * If this is a new decision, it creates all criteria.
  * Otherwise, it updates existing criteria and creates new criterion if needed.
  */
  onSave(): void {
    const criteria = this.criteriaForm.value.criteria;

    // If it's a new decision, add all criteria
    if(this.isNewDecision) {
      this.saveCriteriaForNewDecision(criteria);
      this.router.navigate(['/decisions/create/step4'])
    } else {
    // If it's an existing decision, update existing and add new criteria
      this.updateAndAddCriteriaForExistingDecision(criteria);
      this.router.navigate(['/decisions/create/step4'])
    }
  }

  /**
 * Handles saving criteria for a new decision.
 */
private saveCriteriaForNewDecision(criteria: Criteria[]): void {
  if (this.decisionId) {
    this.decisionService.addCriteriaToDecision(this.decisionId, criteria)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      });
  } else {
    console.error('Decision ID not found!');
  }
}

/**
 * Handles updating existing criteria and adding new criteria for an existing decision.
 * @param criteria - The criteria array from the form.
 */
private updateAndAddCriteriaForExistingDecision(criteria: Criteria[]): void {
  const newCriterionToAdd: Criteria[] = []; // To collect new criteria to add

  // Loop through each criterion and check against the original criteria
  criteria.forEach((newCriterion: Criteria, index: number) => {
    console.log('Processing criterion at index', index, ':', newCriterion);
    const originalCriterion = this.originalCriteria[index];
    const criteriaId = originalCriterion ? originalCriterion.id : null;

    if (criteriaId) {
      // Update existing criteria
      console.log('Updating existing criterion with ID', criteriaId);
      this.updateExistingCriteria(criteriaId, newCriterion);
    } else {
      console.log('Adding new criterion:', newCriterion);
      // Collect new options to add
      newCriterionToAdd.push(newCriterion);
    }
  });
  if (newCriterionToAdd.length > 0) {
    console.log('Creating new criteria:', newCriterionToAdd);
    // Create new criteria
    this.createNewCriteria(newCriterionToAdd);
  }
}

/**
 * Updates an existing criterion.
 * @param criteriaId - The ID of the criterion to update.
 * @param newCriterion - The new criterion data.
 */
private updateExistingCriteria(criteriaId: number, newCriterion: Criteria): void {
  this.decisionService.updateCriteria(this.decisionId!, criteriaId, newCriterion).subscribe(
    response => {
      console.log("Successfully updated criteria", response);
    },
    error => {
      console.log("Failed to update criteria", error);
    }
  );
}

/**
 * Creates new criterion.
 * @param newCriteria - An array of new criteria to add.
 */
private createNewCriteria(newCriteria: Criteria[]): void {
  this.decisionService.addCriteriaToDecision(this.decisionId!, newCriteria).subscribe(
    response => {
      console.log("Successfully added new criteria", response);
    },
    error => {
      console.log("Failed to add new criteria", error);
    }
  );
}

}
