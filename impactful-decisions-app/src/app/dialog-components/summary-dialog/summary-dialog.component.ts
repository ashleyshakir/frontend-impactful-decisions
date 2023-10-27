import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.scss']
})
export class SummaryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SummaryDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
