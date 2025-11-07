import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineryServiceMock } from './machinery.service.mock';
import { Machinery } from '../../shared/models/machinery.model';

@Component({
  selector: 'app-machinery-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section>
      <h2>Gestión de Maquinaria</h2>

      <div class="actions">
        <input [(ngModel)]="searchTerm" placeholder="Buscar por nombre, marca, modelo o ID" />
        <button (click)="search()">Buscar</button>
        <button [routerLink]="['/machinery/new']">Nueva Maquinaria</button>
        <button type="button" (click)="goBack()">Volver</button>
        <button type="button" (click)="goHome()">Inicio</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Horas Uso</th>
            <th>Fecha Compra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let machinery of machineryList">
            <td>{{ machinery.id }}</td>
            <td>{{ machinery.name }}</td>
            <td>{{ machinery.brand }}</td>
            <td>{{ machinery.model }}</td>
            <td>{{ translateStatus(machinery.status) }}</td>
            <td>{{ machinery.hoursUsed }}</td>
            <td>{{ machinery.purchaseDate | date:'longDate' }}</td>
            <td>
              <button [routerLink]="['/machinery', machinery.id]">Ver</button>
              <button [routerLink]="['/machinery', machinery.id, 'edit']">Editar</button>
              <button (click)="confirmDeletion(machinery.id)">Eliminar</button>
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
export class MachineryListComponent implements OnInit {
  machineryList: Machinery[] = [];
  searchTerm = '';

  constructor(
    private machineryService: MachineryServiceMock,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.machineryService.getAll().subscribe(data => this.machineryList = data);
  }

  search(): void {
    this.machineryService.search(this.searchTerm).subscribe(data => this.machineryList = data);
  }

  confirmDeletion(id: string): void {
    const confirmado = window.confirm('¿Eliminar esta maquinaria?');
    if (confirmado) {
      this.machineryService.delete(id).subscribe(() => this.search());
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