import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Decision } from '../models/decsion.model';
import { DecisionService } from '../services/decision.service';
import { Router } from '@angular/router';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-decision-details',
  templateUrl: './decision-details.component.html',
  styleUrls: ['./decision-details.component.scss']
})
export class DecisionDetailsComponent implements OnInit {

  decisionId!: number;
  decision!: Decision;

  constructor(private route: ActivatedRoute, 
             private decisionService : DecisionService, 
             private router: Router, 
             private formService : FormService) { }

  ngOnInit(): void {
    this.decisionId = +this.route.snapshot.paramMap.get('id')!;
    this.decisionService.getDecisionDetails(this.decisionId).subscribe(decision => {
      this.decision = decision.data;
    });
  }

  resolveDecision(){
      if(this.decision.resolved){
        this.decision.resolved = false;
      } else {
        this.decision.resolved = true;
      }
      this.decisionService.updateDecision(this.decision).subscribe(decision => {
        this.decision = decision.data;
      });
  }

  goToForm(){
    // Clear out the previous form data 
    this.formService.clearFormData();
    
    // Update the form data with the current decision ID
    this.formService.updateFormData({ decisionId: this.decisionId });

    this.router.navigate(['/decisions/create/step1'])

  }

}
