import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { FormService } from 'src/app/services/form.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { Option } from 'src/app/models/option.model';

@Component({
  selector: 'app-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.scss']
})
export class AddOptionsComponent implements OnInit, OnDestroy {
  
  private subscription!: Subscription;
  optionsForm!: FormGroup;
  decisionId!: number | null;
  originalOptions: Option[] = [];
  isNewDecision: boolean = true;

  constructor(private fb: FormBuilder, 
              private decisionService: DecisionService, 
              private formService : FormService, 
              private router: Router) {       
  }

  ngOnInit(): void {
    // Subscribe to form data to get the decisionId
    this.formService.formData$.subscribe(data => {
      this.decisionId = data.decisionId;
    });

    // Initialize the form
    this.optionsForm = this.fb.group({
      options: this.fb.array([this.createOption()])
    });

    // Load existing form data from the service
    this.formService.loadFormDataFromLocalStorage();

    this.subscription = this.formService.formData$.subscribe(formData => {
      if (this.decisionId) {
        this.handleExistingDecision(this.decisionId);
      } else {
        this.handleNewDecision(formData);
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private clearExistingOptions(): void {
    while (this.options.length) {
      this.options.removeAt(0);
    }
  }
  
  private addOptionsToForm(options: Option[]): void {
    options.forEach((option: Option) => {
      this.options.push(this.createOption(option.name));
    });
  }
  
  private handleNewDecision(formData: any): void {
    if (formData && formData.options && Array.isArray(formData.options)) {
      this.clearExistingOptions();
      this.addOptionsToForm(formData.options);
    }
  }
  private handleExistingDecision(decisionId: number): void {
    this.decisionService.getDecisionOptions(decisionId).subscribe(response => {
      if (response.data && Array.isArray(response.data)) {
        this.isNewDecision = false;
        this.clearExistingOptions();
        this.originalOptions = [...response.data];
        this.addOptionsToForm(response.data);
      }
    });
  }

  createOption(value: string = ''): FormGroup {
    return this.fb.group({
      name: [value, Validators.required]
    });
  }
  get options() {
    return this.optionsForm.get('options') as FormArray;
  }
  addOption(): void {
    this.options.push(this.createOption());
  }
  removeOption(index: number): void {
    this.options.removeAt(index);
    this.decisionService.deleteOption(this.decisionId!, this.originalOptions[index].id!).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }

  /**
 * Handles saving form changes to options.
 * If this is a new decision, it creates all options.
 * Otherwise, it updates existing options and creates new ones if needed.
 */
onSave(): void {
  const options = this.optionsForm.value.options;

  // If it's a new decision, add all options
  if (this.isNewDecision) {
    this.saveOptionsForNewDecision(options);
    this.router.navigate(['/decisions/create/step3']);
  } else {
    // If it's an existing decision, update existing and add new options
    this.updateAndAddOptionsForExistingDecision(options);
    this.router.navigate(['/decisions/create/step3']);
  }
}

/**
 * Handles saving options for a new decision.
 */
private saveOptionsForNewDecision(options: Option[]): void {
  if (this.decisionId) {
    this.decisionService.addOptionsToDecision(options)
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
 * Handles updating existing options and adding new options for an existing decision.
 * @param options - The options array from the form.
 */
private updateAndAddOptionsForExistingDecision(options: Option[]): void {
  const newOptionsToAdd: Option[] = []; // To collect new options to add

  // Loop through each option and check against the original options
  options.forEach((newOption: Option, index: number) => {
    const originalOption = this.originalOptions[index];
    const optionId = originalOption ? originalOption.id : null;

    if (optionId) {
      // Update existing options
      this.updateExistingOption(optionId, newOption);
    } else {
      // Collect new options to add
      newOptionsToAdd.push(newOption);
    }
  });

  if (newOptionsToAdd.length > 0) {
    // Create new options
    this.createNewOptions(newOptionsToAdd);
  }
}

/**
 * Updates an existing option.
 * @param optionId - The ID of the option to update.
 * @param newOption - The new option data.
 */
private updateExistingOption(optionId: number, newOption: Option): void {
  this.decisionService.updateOptions(this.decisionId!, optionId, newOption).subscribe(
    response => {
      console.log("Successfully updated option", response);
    },
    error => {
      console.log("Failed to update option", error);
    }
  );
}

/**
 * Creates new options.
 * @param newOptions - An array of new options to add.
 */
private createNewOptions(newOptions: Option[]): void {
  this.decisionService.addOptionsToDecision(newOptions).subscribe(
    response => {
      console.log("Successfully added new options", response);
    },
    error => {
      console.log("Failed to add new options", error);
    }
  );
}

}
