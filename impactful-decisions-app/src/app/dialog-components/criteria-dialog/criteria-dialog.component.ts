import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-criteria-dialog',
  templateUrl: './criteria-dialog.component.html',
  styleUrls: ['./criteria-dialog.component.scss']
})
export class CriteriaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CriteriaDialogComponent >) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
