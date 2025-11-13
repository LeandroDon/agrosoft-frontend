import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { PlotService } from '../plot.service';
import { Plot } from '../plot.model';
import { ConfirmCardDialogComponent } from '../../../shared/confirm-card-dialog/confirm-card-dialog.component';

@Component({
  selector: 'app-plot-list',
  standalone: true,
  imports: [CommonModule,
            RouterModule,
            FormsModule,
            MatDialogModule,
            MatButtonModule,
            MatCardModule,
            MatInputModule,
            MatTableModule,
            MatIconModule,
            MatTooltipModule,
            MatFormFieldModule],
  templateUrl: './plot-list.component.html',
  styleUrls: ['./plot-list.component.css']
})

export class PlotListComponent implements OnInit {
  dataSource = new MatTableDataSource<Plot>();
  displayedColumns: string[] = ['id', 'name', 'location', 'status', 'actions'];
  searchTerm = '';
  plots: Plot[] = [];

constructor(
  private plotService: PlotService,
  private router: Router,
  private location: Location,
  private dialog: MatDialog
) {}

  ngOnInit(): void {
    this.loadPlots();
  }

  loadPlots(): void {
  this.plotService.getPlots().subscribe(data => {
    this.dataSource.data = data;
  });
}

  search(): void {
      const term = this.searchTerm.trim().toLowerCase();
  
      this.plotService.getPlots().subscribe(data => {
        if (!term) {
          this.dataSource.data = data;
        } else {
          this.dataSource.data = data.filter(plot =>
            plot.id.toLowerCase().includes(term) ||
            plot.name.toLowerCase().includes(term) ||
            plot.location.toLowerCase().includes(term)
          );
        }
      });
    }
  
    openConfirmDialog(plot: Plot): void {
      const dialogRef = this.dialog.open(ConfirmCardDialogComponent, {
        data: {
          title: 'Confirmar eliminación',
          entityType: 'Lote',
          gender: 'male',
          icon: 'grass',
          color: '#fbe9e7',
          fields: [
            { label: 'Nombre', value: plot.name },
            { label: 'N° Catastral', value: plot.cadastralNumber },
            { label: 'Ubicación', value: plot.location }
          ]
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.confirmDeletion(plot.id);
        }
      });
    }
  
    confirmDeletion(id: string): void {
      this.plotService.deletePlot(id).subscribe(() => this.search());
    }

  getStatusClass(status: Plot['status']): string {
    return status;
  }

  translateStatus(status: Plot['status']): string {
    switch (status) {
      case 'free': return 'Libre';
      case 'planted': return 'Sembrado';
      case 'harvested': return 'Cosechado';
      default: return status;
    }
  }
  
  goHome(): void {
    this.router.navigate(['/']);
  }
}