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
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { ConfirmCardDialogComponent } from '../../../shared/confirm-card-dialog/confirm-card-dialog.component';

@Component({
  selector: 'app-employee-list',
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
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  dataSource = new MatTableDataSource<Employee>();
  displayedColumns: string[] = ['id', 'fullname', 'role', 'performancescore', 'actions'];
  searchTerm = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  search(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.employeeService.getEmployees().subscribe(data => {
      if (!term) {
        this.dataSource.data = data;
      } else {
        this.dataSource.data = data.filter(emp =>
          emp.id.toLowerCase().includes(term) ||
          emp.fullname.toLowerCase().includes(term) ||
          emp.role.toLowerCase().includes(term)
        );
      }
    });
  }

  openConfirmDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmCardDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        entityType: 'Empleado',
        gender: 'male',
        icon: 'person',
        color: '#fbe9e7',
        fields: [
          { label: 'Nombre', value: employee.fullname },
          { label: 'Rol', value: employee.role }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmDeletion(employee.id);
      }
    });
  }

  confirmDeletion(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe(() => this.search());
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}