import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-list.component').then(m => m.EmployeeListComponent),
    title: 'Listado de Empleados'
  },
  {
    path: 'new',
    loadComponent: () => import('./employee-form.component').then(m => m.EmployeeFormComponent),
    title: 'Nuevo Empleado'
  },
  {
    path: ':id',
    loadComponent: () => import('./employee-detail.component').then(m => m.EmployeeDetailComponent),
    title: 'Detalle de Empleado'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./employee-form.component').then(m => m.EmployeeFormComponent),
    title: 'Editar Empleado'
  }
];