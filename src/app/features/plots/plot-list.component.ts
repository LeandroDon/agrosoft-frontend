import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlotServiceMock } from './plot.service.mock';
import { Plot } from '../../shared/models/plot.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plot-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section>
      <h2>Gestión de Lotes</h2>

        <div class="actions">
        <input [(ngModel)]="searchTerm" placeholder="Buscar por nombre, ID o número catastral" />
        <button (click)="search()">Buscar</button>
        <button [routerLink]="['/plots/new']">Nuevo Lote</button>
        <button type="button" (click)="goBack()">Volver</button>
        <button type="button" (click)="goHome()">Inicio</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>N° Catastral</th>
            <th>Área (ha)</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let plot of plots">
            <td>{{ plot.id }}</td>
            <td>{{ plot.name }}</td>
            <td>{{ plot.cadastralNumber }}</td>
            <td>{{ plot.area }}</td>
            <td>{{ plot.location }}</td>
            <td>
              <span [ngClass]="getStatusClass(plot.status)">
                {{ translateStatus(plot.status) }}
              </span>
            </td>
            <td>
              <button [routerLink]="['/plots', plot.id]">Ver</button>
              <button [routerLink]="['/plots', plot.id, 'edit']">Editar</button>
              <button (click)="confirmDeletion(plot.id)">Eliminar</button>
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
    span.free { color: green; font-weight: bold; }
    span.planted { color: orange; font-weight: bold; }
    span.harvested { color: brown; font-weight: bold; }
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
export class PlotListComponent implements OnInit {
  plots: Plot[] = [];
  searchTerm = '';

  constructor(
    private plotService: PlotServiceMock,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.plotService.getAll().subscribe(data => this.plots = data);
  }

  search(): void {
    this.plotService.search(this.searchTerm).subscribe(data => this.plots = data);
  }

  confirmDeletion(id: string): void {
    const confirmado = window.confirm('¿Eliminar este lote?');
    if (confirmado) {
      this.plotService.delete(id).subscribe(() => this.search());
    }
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

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}