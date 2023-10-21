import { Component, OnInit } from '@angular/core';
import { Decision } from 'src/app/models/decsion.model';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';
import { Router } from '@angular/router';
import { FormService } from'src/app/services/form.service';

@Component({
  selector: 'app-decision-info',
  templateUrl: './decision-info.component.html',
  styleUrls: ['./decision-info.component.scss']
})
export class DecisionInfoComponent implements OnInit{
  step1Form!: FormGroup;
  titleError: string | null = null;

  constructor(private fb: FormBuilder, private decisionService: DecisionService, 
    private router: Router,
    private formService: FormService) { }

  ngOnInit(): void {
    this.step1Form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
  });

     // Load existing form data from the service
     this.formService.loadFormDataFromLocalStorage();
     const storedData = this.formService.getFormData();
     if (storedData && storedData.title && storedData.description) {
        this.step1Form.patchValue(storedData);
     }
}

  onSave(): void {
    if(this.step1Form.valid) {
      const decisionData : Decision = this.step1Form.value;
      this.decisionService.createDecision(decisionData).subscribe(response => {
        if(response && response.message === "success, decision created") {
          this.formService.updateFormData(decisionData); // Store to local storage
          this.router.navigate(['/decisions/create/step2']);
        } else  {
          this.titleError = response.message;
        }
      }, error => {
        console.log(error)
      });
    } else {
      console.error('Form is not valid');
    }
  }
}
