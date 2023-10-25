import { Component, OnInit, OnDestroy } from '@angular/core';
import { DecisionService } from 'src/app/services/decision.service';
import { Decision } from 'src/app/models/decsion.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-decision-stats',
  templateUrl: './decision-stats.component.html',
  styleUrls: ['./decision-stats.component.scss']
})
export class DecisionStatsComponent implements OnInit, OnDestroy {

  allDecisions: Decision[] = [];
  totalDecisions: number = 0;
  resolvedPercentage : number = 0;
  pendingPercentage : number = 0;
  private decisionChangeSubscription!: Subscription;


  constructor(private decisionService : DecisionService) { }

  ngOnInit(): void {
    this.updateDecisionStats();

    this.decisionChangeSubscription = this.decisionService.decisionsChanged.subscribe(()=>{
      this.updateDecisionStats();
    })
  }

  ngOnDestroy(): void {
    this.decisionChangeSubscription.unsubscribe();
  }

  updateDecisionStats(){
    this.decisionService.getDecisions().subscribe(
      (response) => {
          this.allDecisions = response.data
          this.getTotalDecisions()
          this.getResolvedPercentage()
          this.getPendingPercentage()
      },
      (error) => {
        console.log("Error: ", error);
      }
    );
  }

  getTotalDecisions(): number {
    return this.totalDecisions = this.decisionService.totalDecisions(this.allDecisions);
  }
  getResolvedPercentage(): number {
    return this.resolvedPercentage = this.decisionService.resolvedPercentage(this.allDecisions);
  }
  getPendingPercentage(): number {
    this.pendingPercentage = 100 - this.resolvedPercentage;
    return this.pendingPercentage;
  }
  
}
