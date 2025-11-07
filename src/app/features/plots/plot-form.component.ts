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
import { Plot } from '../../shared/models/plot.model';
import { PlotServiceMock } from './plot.service.mock';

@Component({
  selector: 'app-plot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()">
        <h3>{{ plot ? 'Editar Lote' : 'Nuevo Lote' }}</h3>

        <label>Nombre</label>
        <input formControlName="name" />

        <label>Número Catastral</label>
        <input formControlName="cadastralNumber" />

        <label>Área (ha)</label>
        <input type="number" formControlName="area" />

        <label>Ubicación</label>
        <input formControlName="location" />

        <label>Estado</label>
        <select formControlName="status">
          <option value="free">Libre</option>
          <option value="planted">Sembrado</option>
          <option value="harvested">Cosechado</option>
        </select>

        <h4>Tareas</h4>
        <div formArrayName="tasks">
          <div *ngFor="let task of tasks.controls; let i = index" [formGroupName]="i">
            <label>Tipo</label>
            <select formControlName="type">
              <option value="planting">Siembra</option>
              <option value="spraying">Fumigación</option>
              <option value="harvesting">Cosecha</option>
            </select>

            <label>Fecha</label>
            <input type="date" formControlName="date" />

            <h5>Insumos</h5>
            <div formArrayName="inputs">
              <div *ngFor="let input of getInputs(i).controls; let j = index" [formGroupName]="j">
                <input formControlName="name" placeholder="Nombre" />
                <select formControlName="type">
                  <option value="seed">Semilla</option>
                  <option value="fertilizer">Fertilizante</option>
                  <option value="agrochemical">Agroquímico</option>
                </select>
                <input type="number" formControlName="quantity" placeholder="Cantidad" />
                <input formControlName="unit" placeholder="Unidad" />
              </div>
              <button type="button" (click)="addInput(i)">+ Insumo</button>
            </div>
          </div>
          <button type="button" (click)="addTask()">+ Tarea</button>
        </div>

        <h4>Lluvias</h4>
        <div formArrayName="rainfall">
          <div *ngFor="let rain of rainfall.controls; let i = index" [formGroupName]="i">
            <label>Fecha</label>
            <input type="date" formControlName="date" />
            <label>Milímetros</label>
            <input type="number" formControlName="millimeters" />
          </div>
          <button type="button" (click)="addRain()">+ Lluvia</button>
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
    h4, h5 {
      margin-top: 1rem;
    }
  `]
})
export class PlotFormComponent implements OnInit {
  form!: FormGroup;
  plot?: Plot;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private plotService: PlotServiceMock
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plotService.getById(id).subscribe(data => {
        if (!data) {
          alert('Lote no encontrado');
          this.router.navigate(['/plots']);
          return;
        }
        this.plot = data;
        this.form = this.fb.group({
          name: [data.name, Validators.required],
          cadastralNumber: [data.cadastralNumber, Validators.required],
          area: [data.area, [Validators.required, Validators.min(0.1)]],
          location: [data.location, Validators.required],
          status: [data.status, Validators.required],
          tasks: this.fb.array(data.tasks.map(task =>
            this.fb.group({
              type: [task.type, Validators.required],
              date: [task.date, Validators.required],
              inputs: this.fb.array(task.inputs.map(input =>
                this.fb.group({
                  name: [input.name, Validators.required],
                  type: [input.type, Validators.required],
                  quantity: [input.quantity, [Validators.required, Validators.min(0.1)]],
                  unit: [input.unit, Validators.required]
                })
              ))
            })
          )),
          rainfall: this.fb.array(data.rainfall.map(rain =>
            this.fb.group({
              date: [rain.date, Validators.required],
              millimeters: [rain.millimeters, [Validators.required, Validators.min(0)]]
            })
          ))
        });
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        cadastralNumber: ['', Validators.required],
        area: [0, [Validators.required, Validators.min(0.1)]],
        location: ['', Validators.required],
        status: ['free', Validators.required],
        tasks: this.fb.array([]),
        rainfall: this.fb.array([])
      });
    }
  }

  get tasks(): FormArray {
    return this.form.get('tasks') as FormArray;
  }

  get rainfall(): FormArray {
    return this.form.get('rainfall') as FormArray;
  }

  getInputs(taskIndex: number): FormArray {
    return this.tasks.at(taskIndex).get('inputs') as FormArray;
  }

  addTask(): void {
    this.tasks.push(this.fb.group({
      type: ['planting', Validators.required],
      date: [new Date(), Validators.required],
      inputs: this.fb.array([])
    }));
  }

  addInput(taskIndex: number): void {
    this.getInputs(taskIndex).push(this.fb.group({
      name: ['', Validators.required],
      type: ['seed', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.1)]],
      unit: ['', Validators.required]
    }));
  }

  addRain(): void {
    this.rainfall.push(this.fb.group({
      date: [new Date(), Validators.required],
      millimeters: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  submit(): void {
    if (this.form.valid) {
      const updatedPlot: Plot = {
        ...this.form.value,
        id: this.plot?.id ?? crypto.randomUUID()
      };

      const action = this.plot
        ? this.plotService.update(updatedPlot)
        : this.plotService.create(updatedPlot);

      action.subscribe(() => this.router.navigate(['/plots']));
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
