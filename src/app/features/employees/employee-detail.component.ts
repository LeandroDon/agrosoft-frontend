import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeServiceMock } from './employee.service.mock';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section *ngIf="employee">
      <h2>Detalle del Empleado: {{ employee.fullName }}</h2>

      <div class="info">
        <p><strong>ID:</strong> {{ employee.id }}</p>
        <p><strong>Rol:</strong> {{ employee.role }}</p>
        <p><strong>Antigüedad:</strong> {{ employee.seniority }}</p>
        <p><strong>Horas disponibles:</strong> {{ employee.availableHours }}</p>
        <p><strong>Horas extra:</strong> {{ employee.overtimeHours }}</p>
        <p><strong>Salario:</strong> {{ employee.salary | currency:'USD' }}</p>
        <p><strong>Desempeño:</strong> {{ employee.performanceScore }}%</p>
      </div>

      <h3>Tareas asignadas</h3>
      <div *ngIf="employee.assignedTasks.length > 0; else noTasks">
        <ul>
          <li *ngFor="let task of employee.assignedTasks" class="task">
            {{ task }}
          </li>
        </ul>
      </div>
      <ng-template #noTasks><p>No hay tareas asignadas.</p></ng-template>

      <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: center;">
        <button type="button" (click)="goBack()">Volver</button>
        <button type="button" (click)="goHome()">Inicio</button>
      </div>
    </section>
  `,
  styles: [`
    section {
      max-width: 700px;
      margin: auto;
    }
    .info p { margin: 0.3rem 0; }
    .task {
      margin-bottom: 0.5rem;
      padding: 0.4rem;
      border-left: 4px solid #4caf50;
      background-color: #f0f0f0;
      border-radius: 4px;
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  employee?: Employee;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private employeeService: EmployeeServiceMock
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getById(id).subscribe(data => this.employee = data);
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}