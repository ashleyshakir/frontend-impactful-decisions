import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { FormService } from 'src/app/services/form.service';
import { Subscription } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-criteria',
  templateUrl: './add-criteria.component.html',
  styleUrls: ['./add-criteria.component.scss']
})
export class AddCriteriaComponent implements OnInit, OnDestroy{
  criteriaForm!: FormGroup;
  decisionId = this.decisionService.decisionId;
  private subscription!: Subscription;

  constructor(private fb: FormBuilder, private decisionService: DecisionService, private formService : FormService, private router: Router) { }

  ngOnInit(): void {
    this.criteriaForm = this.fb.group({
    criteria : this.fb.array([this.createCriteria()
    ], this.validateTotalWeight.bind(this))
    
  });

  // Load existing form data from the service
  this.formService.loadFormDataFromLocalStorage();
  this.subscription = this.formService.formData$.subscribe(data => {
    if (data && data.criteria && Array.isArray(data.criteria)) {
      while(this.criteria.length) {
        this.criteria.removeAt(0);
      }
      data.criteria.forEach((criterion: any) => {
        this.criteria.push(this.createCriteria(criterion.name, criterion.weight));
        })
      }
    });

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  }

  onSave(): void {
    if (!this.criteriaForm.valid) {
      console.error('The form is invalid.');
      return;
    }
    const criteria = this.criteriaForm.value.criteria;
    
    this.formService.updateFormData({ criteria: criteria });
    if (this.decisionId) {
      this.decisionService.addCriteriaToDecision(criteria)
        .subscribe(response => {
          console.log(response);
          this.formService.updateFormData({ criteria: response }); 
          this.router.navigate(['/decisions/create/step4']);
        }, error => {
          console.log(error);
        });
    } else {
      console.error('Decision ID not found!');
    }
  }


  trackByIndex(index: number): number {
    return index;
  }



}
