import { Component, OnInit } from '@angular/core';
import { Decision } from 'src/app/models/decsion.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DecisionService } from 'src/app/services/decision.service';

@Component({
  selector: 'app-decision-info',
  templateUrl: './decision-info.component.html',
  styleUrls: ['./decision-info.component.scss']
})
export class DecisionInfoComponent implements OnInit{
  step1Form!: FormGroup;

  constructor(private fb: FormBuilder, private decisionService: DecisionService) { }

  ngOnInit(): void {
    this.step1Form = this.fb.group({
      title: [''],
      description: ['']
  });
}

  onSave(): void {
    if(this.step1Form.valid) {
      const decisionData : Decision = this.step1Form.value;
      this.decisionService.createDecision(decisionData).subscribe(response => {
        console.log('Decision saved successfully!', response);
      }, error => {
        console.error('Error while saving decision:', error);
      });
    } else {
      console.error('Form is not valid');
    }
  }
}
