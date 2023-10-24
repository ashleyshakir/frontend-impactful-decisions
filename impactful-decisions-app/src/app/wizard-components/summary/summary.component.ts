import { Component, OnInit } from '@angular/core';
import { DecisionService } from 'src/app/services/decision.service';
import { Decision } from 'src/app/models/decsion.model';
import { Option } from 'src/app/models/option.model';
import { Criteria } from'src/app/models/criteria.model';
import { ProConItem } from 'src/app/models/procon.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  decision!: Decision;
  decisionTitle = '';
  decisionDescription = '';
  optionList: Option[] = [];
  criteriaList: Criteria[] = [];
  proConList: ProConItem[] = [];

  constructor(private decisionService: DecisionService, private router : Router) { }

  ngOnInit(): void {
    this.decisionService.getDecisionById().subscribe(decision => {
      console.log(decision);
      this.decision = decision.data;
      this.decisionTitle = decision.data.title;
      this.decisionDescription = decision.data.description;

      this.optionList = decision.data.optionList? decision.data.optionList : [];
      this.proConList = ([] as ProConItem[]).concat(...this.optionList.map(option => option.proConList || []));

      this.criteriaList = decision.data.criteriaList? decision.data.criteriaList : [];
      
    })
  }
  analyzeDecision() {
    this.router.navigate(['decisions/create/step6'])
  }

}
