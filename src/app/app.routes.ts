import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { plotRoutes } from './features/plots/plot.routes';
import { employeeRoutes } from './features/employees/employee.routes';
import { machineryRoutes } from './features/machinery/machinery.routes';    

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Agrosoft - Inicio',
  },
  {
    path: 'plots',
    children: plotRoutes
  },
  {
    path: 'employees',
    children: employeeRoutes
  },
  {
    path: 'machinery',
    children: machineryRoutes
  },
  {
    path: '**',
    redirectTo: '',
  },
];