import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Decision } from '../models/decsion.model';
import { DecisionService } from '../services/decision.service';

@Component({
  selector: 'app-decision-details',
  templateUrl: './decision-details.component.html',
  styleUrls: ['./decision-details.component.scss']
})
export class DecisionDetailsComponent implements OnInit {

  decisionId!: number;
  decision!: Decision;

  constructor(private route: ActivatedRoute, private decisionService : DecisionService) { }

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

}
