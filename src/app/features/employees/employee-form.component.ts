import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Employee } from '../../shared/models/employee.model';
import { EmployeeServiceMock } from './employee.service.mock';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
        <h3>{{ employee ? 'Editar Empleado' : 'Nuevo Empleado' }}</h3>

        <label>Nombre completo</label>
        <input formControlName="fullName" />

        <label>Rol</label>
        <input formControlName="role" />

        <label>Antigüedad</label>
        <input type="number" formControlName="seniority" />

        <label>Horas disponibles</label>
        <input type="number" formControlName="availableHours" />

        <label>Horas extra</label>
        <input type="number" formControlName="overtimeHours" />

        <label>Salario</label>
        <input type="number" formControlName="salary" />

        <label>Puntaje de desempeño</label>
        <input type="number" formControlName="performanceScore" />

        <h4>Tareas asignadas</h4>
        <div formArrayName="assignedTasks">
          <div *ngFor="let task of assignedTasks.controls; let i = index">
            <input [formControlName]="i" placeholder="Título de tarea" />
            <button type="button" (click)="removeTask(i)">Eliminar tarea</button>
          </div>
          <button type="button" (click)="addTask()">+ Tarea</button>
        </div>

        <button type="submit" [disabled]="form.invalid">Guardar</button>
      </form>

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
    form {
      display: grid;
      gap: 1rem;
    }
    input, select {
      padding: 0.5rem;
      width: 100%;
    }
    button {
      padding: 0.4rem 0.8rem;
    }
    h4 {
      margin-top: 1rem;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  employee?: Employee;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private employeeService: EmployeeServiceMock
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getById(id).subscribe(data => {
        if (!data) {
          alert('Empleado no encontrado');
          this.router.navigate(['/employees']);
          return;
        }
        this.employee = data;
        this.form = this.fb.group({
          fullName: [data.fullName, Validators.required],
          role: [data.role, Validators.required],
          seniority: [data.seniority, [Validators.required, Validators.min(0)]],
          availableHours: [data.availableHours, [Validators.required, Validators.min(0)]],
          overtimeHours: [data.overtimeHours, [Validators.required, Validators.min(0)]],
          salary: [data.salary, [Validators.required, Validators.min(0)]],
          performanceScore: [data.performanceScore, [Validators.required, Validators.min(0), Validators.max(100)]],
          assignedTasks: this.fb.array(data.assignedTasks.map(task =>
            this.fb.control(task, Validators.required)
          ))
        });
      });
    } else {
      this.form = this.fb.group({
        fullName: ['', Validators.required],
        role: ['', Validators.required],
        seniority: [0, [Validators.required, Validators.min(0)]],
        availableHours: [0, [Validators.required, Validators.min(0)]],
        overtimeHours: [0, [Validators.required, Validators.min(0)]],
        salary: [0, [Validators.required, Validators.min(0)]],
        performanceScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        assignedTasks: this.fb.array([])
      });
    }
  }

  get assignedTasks(): FormArray {
    return this.form.get('assignedTasks') as FormArray;
  }

  addTask(): void {
    this.assignedTasks.push(this.fb.control('', Validators.required));
  }

  removeTask(index: number): void {
    this.assignedTasks.removeAt(index);
  }

  submit(): void {
    if (this.form.valid) {
      const updatedEmployee: Employee = {
        ...this.form.value,
        id: this.employee?.id ?? crypto.randomUUID()
      };

      const action = this.employee
        ? this.employeeService.update(updatedEmployee)
        : this.employeeService.create(updatedEmployee);

      action.subscribe(() => this.router.navigate(['/employees']));
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}