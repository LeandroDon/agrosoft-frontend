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
import { Machinery } from '../../shared/models/machinery.model';
import { MachineryServiceMock } from './machinery.service.mock';

@Component({
  selector: 'app-machinery-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
        <h3>{{ machinery ? 'Editar Maquinaria' : 'Nueva Maquinaria' }}</h3>

        <label>Nombre</label>
        <input formControlName="name" />

        <label>Marca</label>
        <input formControlName="brand" />

        <label>Modelo</label>
        <input formControlName="model" />

        <label>Estado</label>
        <select formControlName="status">
          <option value="active">Activa</option>
          <option value="maintenance">En mantenimiento</option>
          <option value="retired">Retirada</option>
        </select>

        <label>Horas de uso</label>
        <input type="number" formControlName="hoursUsed" />

        <label>Fecha de compra</label>
        <input type="date" formControlName="purchaseDate" />

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
export class MachineryFormComponent implements OnInit {
  form!: FormGroup;
  machinery?: Machinery;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private machineryService: MachineryServiceMock
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.machineryService.getById(id).subscribe(data => {
        if (!data) {
          alert('Maquinaria no encontrada');
          this.router.navigate(['/machinery']);
          return;
        }
        this.machinery = data;
        this.form = this.fb.group({
          name: [data.name, Validators.required],
          brand: [data.brand, Validators.required],
          model: [data.model, Validators.required],
          status: [data.status, Validators.required],
          hoursUsed: [data.hoursUsed, [Validators.required, Validators.min(0)]],
          purchaseDate: [this.toDateInputValue(data.purchaseDate), Validators.required],
          assignedTasks: this.fb.array(data.assignedTasks.map(task =>
            this.fb.control(task, Validators.required)
          ))
        });
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        brand: ['', Validators.required],
        model: ['', Validators.required],
        status: ['active', Validators.required],
        hoursUsed: [0, [Validators.required, Validators.min(0)]],
        purchaseDate: [this.toDateInputValue(new Date()), Validators.required],
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
      const updatedMachinery: Machinery = {
        ...this.form.value,
        id: this.machinery?.id ?? crypto.randomUUID()
      };

      const action = this.machinery
        ? this.machineryService.update(updatedMachinery)
        : this.machineryService.create(updatedMachinery);

      action.subscribe(() => this.router.navigate(['/machinery']));
    }
  }

  toDateInputValue(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}