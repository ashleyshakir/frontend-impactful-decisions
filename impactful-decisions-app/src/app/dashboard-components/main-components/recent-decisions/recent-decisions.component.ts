import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Decision } from 'src/app/models/decsion.model';
import { DecisionService } from'src/app/services/decision.service';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recent-decisions',
  templateUrl: './recent-decisions.component.html',
  styleUrls: ['./recent-decisions.component.scss']
})
export class RecentDecisionsComponent implements OnInit {
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  allDecisions: Decision[] = [];
  recentDecisions: Decision[] = [];
  hasDecisions: boolean = true; 
  

  constructor(private route: ActivatedRoute, private router: Router, private decisionService : DecisionService) { }

  ngOnInit(): void {

    this.decisionService.getDecisions().subscribe(
      (response) => {
        if (Array.isArray(response.data)) { 
        this.allDecisions = response.data.sort((a, b) => {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        this.recentDecisions = this.allDecisions.slice(0, 2);
        this.hasDecisions = this.recentDecisions.length > 0;
      } else {
        console.log('No decisions available or unexpected data format');
        this.allDecisions = [];
        this.recentDecisions = [];
        }
      },
      (error) => {
        console.log("Error: ", error);
        if (error && error.error && error.error.message === "You have no decisions!") {
          console.log('User has no decisions');
          this.hasDecisions = false;
        }
      }
    );
  }

}
