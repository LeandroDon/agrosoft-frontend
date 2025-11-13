import { Routes } from '@angular/router';

export const plotRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./plot-list/plot-list.component').then(m => m.PlotListComponent),
    title: 'Agrosoft - Lotes'
  },
  {
    path: 'new',
    loadComponent: () => import('./plot-form/plot-form.component').then(m => m.PlotFormComponent),
    title: 'Agrosoft - Agregar Lote'
  },
  {
    path: ':id',
    loadComponent: () => import('./plot-detail/plot-detail.component').then(m => m.PlotDetailComponent),
    title: 'Agrosoft - Detalle de Lote'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./plot-form/plot-form.component').then(m => m.PlotFormComponent),
    title: 'Agrosoft - Editar Lote'
  }
];