import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MachineryServiceMock } from './machinery.service.mock';
import { Machinery } from '../../shared/models/machinery.model';

@Component({
  selector: 'app-machinery-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section *ngIf="machinery">
      <h2>Detalle de Maquinaria: {{ machinery.name }}</h2>

      <div class="info">
        <p><strong>ID:</strong> {{ machinery.id }}</p>
        <p><strong>Marca:</strong> {{ machinery.brand }}</p>
        <p><strong>Modelo:</strong> {{ machinery.model }}</p>
        <p><strong>Estado:</strong> {{ translateStatus(machinery.status) }}</p>
        <p><strong>Horas de uso:</strong> {{ machinery.hoursUsed }}</p>
        <p><strong>Fecha de compra:</strong> {{ machinery.purchaseDate | date:'longDate' }}</p>
      </div>

      <h3>Tareas asignadas</h3>
      <div *ngIf="machinery.assignedTasks.length > 0; else noTasks">
        <ul>
          <li *ngFor="let task of machinery.assignedTasks" class="task">
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
      border-left: 4px solid #2196f3;
      background-color: #f0f0f0;
      border-radius: 4px;
    }
  `]
})
export class MachineryDetailComponent implements OnInit {
  machinery?: Machinery;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private machineryService: MachineryServiceMock
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.machineryService.getById(id).subscribe(data => this.machinery = data);
    }
  }

  translateStatus(status: Machinery['status']): string {
    switch (status) {
      case 'active': return 'Activa';
      case 'maintenance': return 'En mantenimiento';
      case 'retired': return 'Retirada';
      default: return status;
    }
  }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}