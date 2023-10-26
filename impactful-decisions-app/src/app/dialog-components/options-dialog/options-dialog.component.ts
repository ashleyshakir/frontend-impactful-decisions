import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-options-dialog',
  templateUrl: './options-dialog.component.html',
  styleUrls: ['./options-dialog.component.scss']
})
export class OptionsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OptionsDialogComponent >) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
