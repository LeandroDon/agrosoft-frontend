import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlotServiceMock } from './plot.service.mock';
import { Plot } from '../../shared/models/plot.model';

@Component({
  selector: 'app-plot-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section *ngIf="plot">
      <h2>Detalle del Lote: {{ plot.name }}</h2>

      <div class="info">
        <p><strong>ID:</strong> {{ plot.id }}</p>
        <p><strong>N° Catastral:</strong> {{ plot.cadastralNumber }}</p>
        <p><strong>Área:</strong> {{ plot.area }} ha</p>
        <p><strong>Ubicación:</strong> {{ plot.location }}</p>
        <p><strong>Estado:</strong>
          <span [ngClass]="plot.status">{{ translateStatus(plot.status) }}</span>
        </p>
      </div>

      <h3>Tareas realizadas</h3>
      <div *ngIf="plot.tasks.length > 0; else noTasks">
        <div *ngFor="let task of plot.tasks" class="task">
          <p><strong>Tipo:</strong> {{ translateTask(task.type) }}</p>
          <p><strong>Fecha:</strong> {{ task.date | date:'longDate' }}</p>
          <p><strong>Insumos:</strong></p>
          <ul>
            <li *ngFor="let input of task.inputs">
              <span [ngClass]="input.type">
                {{ input.name }} ({{ translateInput(input.type) }}): {{ input.quantity }} {{ input.unit }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <ng-template #noTasks><p>No hay tareas registradas.</p></ng-template>

      <h3>Lluvias registradas</h3>
      <div *ngIf="plot.rainfall.length > 0; else noRain">
        <div *ngFor="let rain of plot.rainfall" class="task">
          <p><strong>Fecha:</strong> {{ rain.date | date:'longDate' }}</p>
          <p><strong>Milímetros:</strong> {{ rain.millimeters }} mm</p>
        </div>
      </div>
      <ng-template #noRain><p>No hay datos de lluvia.</p></ng-template>

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
      margin-bottom: 1rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .free { color: green; font-weight: bold; }
    .planted { color: orange; font-weight: bold; }
    .harvested { color: brown; font-weight: bold; }
    .seed { color: teal; }
    .fertilizer { color: olive; }
    .agrochemical { color: crimson; }
  `]
})
export class PlotDetailComponent implements OnInit {
  plot?: Plot;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private plotService: PlotServiceMock
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plotService.getById(id).subscribe(data => this.plot = data);
    }
  }

  translateStatus(status: Plot['status']): string {
    switch (status) {
      case 'free': return 'Libre';
      case 'planted': return 'Sembrado';
      case 'harvested': return 'Cosechado';
      default: return status;
    }
  }

  translateTask(type: 'planting' | 'spraying' | 'harvesting'): string {
    switch (type) {
      case 'planting': return 'Siembra';
      case 'spraying': return 'Fumigación';
      case 'harvesting': return 'Cosecha';
      default: return type;
    }
  }

  translateInput(type: 'seed' | 'fertilizer' | 'agrochemical'): string {
    switch (type) {
      case 'seed': return 'Semilla';
      case 'fertilizer': return 'Fertilizante';
      case 'agrochemical': return 'Agroquímico';
      default: return type;
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}