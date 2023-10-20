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
  

  constructor(private route: ActivatedRoute, private router: Router, private decisionService : DecisionService) { }

  ngOnInit(): void {

    this.decisionService.getDecisions().subscribe(
      (response) => {
        this.allDecisions = response.data.sort((a, b) => {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        this.recentDecisions = this.allDecisions.slice(0, 2);
      },
      (error) => {
        console.log("Error: ", error);
      }
    );

  }

}
