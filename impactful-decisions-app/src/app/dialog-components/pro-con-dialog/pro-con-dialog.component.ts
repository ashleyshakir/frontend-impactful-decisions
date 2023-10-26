import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pro-con-dialog',
  templateUrl: './pro-con-dialog.component.html',
  styleUrls: ['./pro-con-dialog.component.scss']
})
export class ProConDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProConDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
