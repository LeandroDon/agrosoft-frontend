import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmCardData } from './confirm-card-dialog.model';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-confirm-card-dialog',
  templateUrl: './confirm-card-dialog.component.html',
  styleUrls: ['./confirm-card-dialog.component.css'],
  imports: [MatCardModule,
            CommonModule,
            MatButtonModule,
            MatIcon,
            MatDivider],
})
export class ConfirmCardDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmCardData,
    private dialogRef: MatDialogRef<ConfirmCardDialogComponent>
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}