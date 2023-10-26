import { Component, OnInit } from '@angular/core';
import { DecisionService } from'src/app/services/decision.service';
import { Decision } from 'src/app/models/decsion.model';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialog-components/confirm-dialog/confirm-dialog.component';

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

  constructor(private decisionService : DecisionService, private router: Router, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchAllDecisions(this.authService.user!)
  }
  deleteDecision(decisionId: number): void {
    // Show confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.decisionService.deleteDecision(decisionId).subscribe(
          (response) => {
            console.log("Successfully deleted decision:", response);
            this.fetchAllDecisions(this.authService.user!);
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
  viewDecisionDetails(decisionId: number): void {
    this.router.navigate(['/decisions/' + decisionId]);
  }

  fetchAllDecisions(user : User){
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
