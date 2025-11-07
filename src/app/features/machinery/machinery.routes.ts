import { Routes } from '@angular/router';

export const machineryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./machinery-list.component').then(m => m.MachineryListComponent),
    title: 'Listado de Maquinaria'
  },
  {
    path: 'new',
    loadComponent: () => import('./machinery-form.component').then(m => m.MachineryFormComponent),
    title: 'Nueva Maquinaria'
  },
  {
    path: ':id',
    loadComponent: () => import('./machinery-detail.component').then(m => m.MachineryDetailComponent),
    title: 'Detalle de Maquinaria'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./machinery-form.component').then(m => m.MachineryFormComponent),
    title: 'Editar Maquinaria'
  }
];