import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../../shared/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeServiceMock {
  private employees: Employee[] = [
    {
      id: crypto.randomUUID(),
      fullName: 'María González',
      role: 'Ingeniera de Datos',
      seniority: 4,
      availableHours: 30,
      salary: 4500,
      overtimeHours: 5,
      performanceScore: 92,
      assignedTasks: []
    },
    {
      id: crypto.randomUUID(),
      fullName: 'Julián Pérez',
      role: 'Desarrollador Frontend',
      seniority: 2,
      availableHours: 40,
      salary: 3800,
      overtimeHours: 0,
      performanceScore: 85,
      assignedTasks: []
    }
  ];

  getAll(): Observable<Employee[]> {
    return of(this.employees);
  }

  getById(id: string): Observable<Employee | undefined> {
    const employee = this.employees.find(e => e.id === id);
    return of(employee ? { ...employee } : undefined);
  }

  create(employee: Employee): Observable<Employee> {
    const newEmployee = { ...employee, id: employee.id ?? crypto.randomUUID() };
    this.employees.push(newEmployee);
    return of(newEmployee);
  }

  update(employee: Employee): Observable<Employee> {
    const index = this.employees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      this.employees[index] = { ...employee };
    }
    return of(employee);
  }

  delete(id: string): Observable<void> {
    this.employees = this.employees.filter(e => e.id !== id);
    return of(void 0);
  }

  search(term: string): Observable<Employee[]> {
    const lower = term.toLowerCase();
    return of(
      this.employees.filter(e =>
        e.fullName.toLowerCase().includes(lower) ||
        e.role.toLowerCase().includes(lower) ||
        e.id.toLowerCase() === lower
      )
    );
  }

  getReport(type: 'performance' | 'availability' | 'tasks'): Observable<any[]> {
    if (type === 'performance') {
      return of(
        this.employees.map(e => ({
          employee: e.fullName,
          score: e.performanceScore,
          seniority: e.seniority
        }))
      );
    }

    if (type === 'availability') {
      return of(
        this.employees.map(e => ({
          employee: e.fullName,
          availableHours: e.availableHours,
          overtimeHours: e.overtimeHours
        }))
      );
    }

    return of([]);
  }
}