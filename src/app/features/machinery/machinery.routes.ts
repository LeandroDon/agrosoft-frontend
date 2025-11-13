import { Routes } from '@angular/router';

export const machineryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./machinery-list/machinery-list.component').then(m => m.MachineryListComponent),
    title: 'Agrosoft - Maquinaria'
  },
  {
    path: 'new',
    loadComponent: () => import('./machinery-form/machinery-form.component').then(m => m.MachineryFormComponent),
    title: 'Agrosoft - Agregar Maquinaria'
  },
  {
    path: ':id',
    loadComponent: () => import('./machinery-detail/machinery-detail.component').then(m => m.MachineryDetailComponent),
    title: 'Agrosoft - Detalle de Maquinaria'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./machinery-form/machinery-form.component').then(m => m.MachineryFormComponent),
    title: 'Agrosoft - Editar Maquinaria'
  }
];