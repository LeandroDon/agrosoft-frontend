import { Routes } from '@angular/router';

export const plotRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./plot-list.component').then(m => m.PlotListComponent),
    title: 'Listado de Lotes'
  },
  {
    path: 'new',
    loadComponent: () => import('./plot-form.component').then(m => m.PlotFormComponent),
    title: 'Nuevo Lote'
  },
  {
    path: ':id',
    loadComponent: () => import('./plot-detail.component').then(m => m.PlotDetailComponent),
    title: 'Detalle de Lote'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./plot-form.component').then(m => m.PlotFormComponent),
    title: 'Editar Lote'
  }
];