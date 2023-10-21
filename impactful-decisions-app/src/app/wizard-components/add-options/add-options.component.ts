import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { FormService } from 'src/app/services/form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.scss']
})
export class AddOptionsComponent implements OnInit, OnDestroy {
  optionsForm!: FormGroup;
  decisionId = this.decisionService.decisionId
  private subscription!: Subscription;

  constructor(private fb: FormBuilder, private decisionService: DecisionService, private formService : FormService) { }

  ngOnInit(): void {
    // Initialize form
    this.optionsForm = this.fb.group({
      options: this.fb.array([this.createOption()])
    });

    // Load existing form data from the service
   this.formService.loadFormDataFromLocalStorage();
   this.subscription = this.formService.formData$.subscribe(data => {
    if (data && data.options && Array.isArray(data.options)) {
      // Clear the existing form array controls
      while (this.options.length) {
        this.options.removeAt(0);
      }
  
      // Push new form groups into the form array for each option in the data
      data.options.forEach((option: any) => {
        this.options.push(this.createOption(option.name));
      });
    }
  });

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
 }
  
  createOption(value: string = ''): FormGroup {
    return this.fb.group({
      name: [value]
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
  }

  onSave(): void {
    const options = this.optionsForm.value.options;
    this.formService.updateFormData({ options: options });
      if (this.decisionId) {
        console.log(options)
        this.decisionService.addOptionsToDecision(options)
          .subscribe(response => {
          console.log(response);
          this.formService.updateFormData({ options: response }); // Update the form data after a successful save
          }, error => {
            console.log(error);
          });
      } else {
        console.error('Decision ID not found!');
      }
    }
  }