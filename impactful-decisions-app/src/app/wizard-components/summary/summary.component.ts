import { Component, OnInit } from '@angular/core';
import { DecisionService } from 'src/app/services/decision.service';
import { Decision } from 'src/app/models/decsion.model';
import { Option } from 'src/app/models/option.model';
import { Criteria } from'src/app/models/criteria.model';
import { ProConItem } from 'src/app/models/procon.model';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { MatDialog } from '@angular/material/dialog';
import { SummaryDialogComponent } from 'src/app/dialog-components/summary-dialog/summary-dialog.component';

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
  decisionId!: number | null;

  constructor(private decisionService: DecisionService,
              private router : Router, 
              private formService: FormService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    
    // Subscribe to form data to get the decisionId
    this.formService.formData$.subscribe(data => {
      this.decisionId = data.decisionId;
      console.log("Decision ID on init: ", this.decisionId);
    });

    this.decisionService.getDecisionDetails(this.decisionId!).subscribe(decision => {
      console.log(decision);
      if (this.decisionId){
        this.decision = decision.data;
        this.decisionTitle = decision.data.title;
        this.decisionDescription = decision.data.description;
  
        this.optionList = decision.data.optionList? decision.data.optionList : [];
        this.proConList = ([] as ProConItem[]).concat(...this.optionList.map(option => option.proConList || []));
  
        this.criteriaList = decision.data.criteriaList? decision.data.criteriaList : [];
      } else {
        console.log("No decision id provided");
      }
    });

    if (!localStorage.getItem('summaryDialog')) {
      this.openDialog();
    }
  }

  analyzeDecision() {
    this.router.navigate(['decisions/create/step6'])
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SummaryDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(() => {
      localStorage.setItem('summaryDialog', 'true');
    });
  }
  

}
