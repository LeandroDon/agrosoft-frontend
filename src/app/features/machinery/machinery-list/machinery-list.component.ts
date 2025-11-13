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
import { MachineryService } from '../machinery.service';
import { Machinery } from '../machinery.model';
import { ConfirmCardDialogComponent } from '../../../shared/confirm-card-dialog/confirm-card-dialog.component';

@Component({
  selector: 'app-machinery-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './machinery-list.component.html',
  styleUrls: ['./machinery-list.component.css']
})
export class MachineryListComponent implements OnInit {
  dataSource = new MatTableDataSource<Machinery>();
  displayedColumns: string[] = ['id', 'name', 'brand', 'model', 'status', 'actions'];
  searchTerm = '';

  constructor(
    private machineryService: MachineryService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMachinery();
  }

  loadMachinery(): void {
    this.machineryService.getMachinery().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  translateStatus(status: Machinery['status']): string {
    switch (status) {
      case 'active': return 'Activa';
      case 'maintenance': return 'En mantenimiento';
      case 'retired': return 'Retirada';
      default: return status;
    }
  }

  search(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.machineryService.getMachinery().subscribe(data => {
      if (!term) {
        this.dataSource.data = data;
      } else {
        this.dataSource.data = data.filter(m =>
          m.id.toLowerCase().includes(term) ||
          m.name.toLowerCase().includes(term) ||
          m.brand.toLowerCase().includes(term) ||
          m.model.toLowerCase().includes(term)
        );
      }
    });
  }

  openConfirmDialog(machinery: Machinery): void {
    const dialogRef = this.dialog.open(ConfirmCardDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        entityType: 'Maquinaria',
        gender: 'female',
        icon: 'agriculture',
        color: '#fbe9e7',
        fields: [
          { label: 'Nombre', value: machinery.name },
          { label: 'Marca', value: machinery.brand },
          { label: 'Modelo', value: machinery.model }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmDeletion(machinery.id);
      }
    });
  }

  confirmDeletion(id: string): void {
    this.machineryService.deleteMachine(id).subscribe(() => this.search());
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
