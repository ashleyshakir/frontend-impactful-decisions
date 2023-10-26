import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Decision } from 'src/app/models/decsion.model';
import { DecisionService } from'src/app/services/decision.service';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialog-components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-recent-decisions',
  templateUrl: './recent-decisions.component.html',
  styleUrls: ['./recent-decisions.component.scss']
})
export class RecentDecisionsComponent implements OnInit, OnDestroy {
  faPencil = faPencil;
  faTrashCan = faTrashCan;
  decision! : Decision;
  allDecisions: Decision[] = [];
  recentDecisions: Decision[] = [];
  hasDecisions: boolean = true; 
  private subscriptions: Subscription = new Subscription();


  constructor(private route: ActivatedRoute,
      private router: Router,
      private decisionService : DecisionService,
      private authService: AuthService, 
      private dialog: MatDialog) { }

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
      })
    );
    const decisionIdStr = this.route.snapshot.paramMap.get('id');
    if (decisionIdStr) {
      const decisionId = +decisionIdStr;
      this.decisionService.getDecisionDetails(decisionId).subscribe(decision => {
        this.decision = decision.data;
      });
    } 
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  viewDecisionDetails(decisionId: number): void {
    this.router.navigate(['/decisions/' + decisionId]);
  }
  deleteDecision(decisionId: number): void {
    console.log("Attempting to delete decision with ID:", decisionId);
    // Show confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.decisionService.deleteDecision(decisionId).subscribe(
          (response) => {
            console.log("Successfully deleted decision:", response);
            this.fetchDecisions(this.authService.user!);
            this.decisionService.decisionsChanged.next();  
          },
          (error) => {
            console.log("Failed to delete decision:", error);
          }
        );
      } else {
        console.log('User canceled the deletion.');
      }
    });
  }

  fetchDecisions(user : User) : void {
    // Reset state variables
    this.allDecisions = [];
    this.recentDecisions = [];
    this.hasDecisions = false;
    this.decisionService.getDecisions().subscribe(
      (response) => {
        if (Array.isArray(response.data)) { 
        this.allDecisions = response.data.sort((a, b) => {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        this.recentDecisions = this.allDecisions.slice(0, 2);
        this.hasDecisions = this.recentDecisions.length > 0;
      } else {
        this.allDecisions = [];
        this.recentDecisions = [];
        }
      },
      (error) => {
        if (error && error.error && error.error.message === "You have no decisions!") {
          this.hasDecisions = false;
        }
      }
    );
  }

}
