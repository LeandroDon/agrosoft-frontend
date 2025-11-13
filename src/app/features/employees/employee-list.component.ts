import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeServiceMock } from './employee.service.mock';
import { Employee } from '../../shared/models/employee.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section>
      <h2>Gestión de Empleados</h2>

      <div class="actions">
        <input [(ngModel)]="searchTerm" placeholder="Buscar por nombre, rol o ID" />
        <button (click)="search()">Buscar</button>
        <button [routerLink]="['/employees/new']">Nuevo Empleado</button>
        <button type="button" (click)="goBack()">Volver</button>
        <button type="button" (click)="goHome()">Inicio</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Antigüedad</th>
            <th>Horas Disponibles</th>
            <th>Horas Extra</th>
            <th>Salario</th>
            <th>Desempeño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let employee of employees">
            <td>{{ employee.id }}</td>
            <td>{{ employee.fullName }}</td>
            <td>{{ employee.role }}</td>
            <td>{{ employee.seniority }}</td>
            <td>{{ employee.availableHours }}</td>
            <td>{{ employee.overtimeHours }}</td>
            <td>{{ employee.salary | currency:'USD' }}</td>
            <td>{{ employee.performanceScore }}%</td>
            <td>
              <button [routerLink]="['/employees', employee.id]">Ver</button>
              <button [routerLink]="['/employees', employee.id, 'edit']">Editar</button>
              <button (click)="confirmDeletion(employee.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `,
  styles: [`
    section {
      max-width: 1000px;
      margin: auto;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
      align-items: center;
    }
    input {
      padding: 0.4rem;
      flex: 1 1 200px;
    }
    button {
      padding: 0.4rem 0.8rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 0.5rem;
      text-align: left;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm = '';

  constructor(
    private employeeService: EmployeeServiceMock,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.employeeService.getAll().subscribe(data => this.employees = data);
  }

  search(): void {
    this.employeeService.search(this.searchTerm).subscribe(data => this.employees = data);
  }

  confirmDeletion(id: string): void {
    const confirmado = window.confirm('¿Eliminar este empleado?');
    if (confirmado) {
      this.employeeService.delete(id).subscribe(() => this.search());
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}