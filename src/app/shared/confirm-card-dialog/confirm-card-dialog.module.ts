import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmCardDialogComponent } from './confirm-card-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    ConfirmCardDialogComponent
  ],
  exports: [ConfirmCardDialogComponent]
})
export class ConfirmCardDialogModule {}