import { Component, OnInit } from '@angular/core';
import { DecisionService } from'src/app/services/decision.service';
import { Decision } from 'src/app/models/decsion.model';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-all-decisions',
  templateUrl: './all-decisions.component.html',
  styleUrls: ['./all-decisions.component.scss']
})
export class AllDecisionsComponent implements OnInit {
  hasDecisions: boolean = true;
  allDecisions: Decision[] = [];
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  constructor(private decisionService : DecisionService) { }

  ngOnInit(): void {
    this.decisionService.getDecisions().subscribe(
      (response) => {
        this.allDecisions = response.data.sort((a, b) => {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        this.hasDecisions = this.allDecisions.length > 0;
      },
      (error) => {
        console.log("Error: ", error);
        if (error && error.error && error.error.message === "You have no decisions!") {
          this.hasDecisions = false;
          console.log('User has no decisions');
        }
      }
    );
  }


}
