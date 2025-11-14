import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    title: 'Agrosoft - Empleados'
  },
  {
    path: 'new',
    loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    title: 'Agrosoft - Agregar Empleado'
  },
  {
    path: ':id',
    loadComponent: () => import('./employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
    title: 'Agrosoft - Detalle de Empleado'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    title: 'Agrosoft - Editar Empleado'
  }
];