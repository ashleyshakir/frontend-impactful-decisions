import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Decision } from 'src/app/models/decsion.model';
import { DecisionService } from'src/app/services/decision.service';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-recent-decisions',
  templateUrl: './recent-decisions.component.html',
  styleUrls: ['./recent-decisions.component.scss']
})
export class RecentDecisionsComponent implements OnInit, OnDestroy {
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  allDecisions: Decision[] = [];
  recentDecisions: Decision[] = [];
  hasDecisions: boolean = true; 
  private subscriptions: Subscription = new Subscription();


  constructor(private route: ActivatedRoute,
     private router: Router,
      private decisionService : DecisionService,
      private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.user) {
      this.fetchDecisions(this.authService.user);
    }
    // Listen for logout events
    this.subscriptions.add(
      this.authService.userLoggedOut.subscribe(() => {
        this.allDecisions = [];
        this.recentDecisions = [];
        this.hasDecisions = false;
        // this.fetchDecisions();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchDecisions(user : User) : void {
    // Reset state variables
    this.allDecisions = [];
    this.recentDecisions = [];
    this.hasDecisions = false;
    this.decisionService.getDecisions().subscribe(
      (response) => {
        console.log('Fetched decisions:', response.data);

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
