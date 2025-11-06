import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Machinery } from '../../shared/models/machinery.model';

@Injectable({ providedIn: 'root' })
export class MachineryServiceMock {
  private machineryList: Machinery[] = [
    {
      id: crypto.randomUUID(),
      name: 'Tractor John Deere 5075E',
      brand: 'John Deere',
      model: '5075E',
      status: 'active',
      hoursUsed: 1200,
      purchaseDate: new Date('2021-03-15'),
      assignedTasks: ['Labranza profunda', 'Transporte de insumos']
    },
    {
      id: crypto.randomUUID(),
      name: 'Pulverizadora Metalfor 7040',
      brand: 'Metalfor',
      model: '7040',
      status: 'maintenance',
      hoursUsed: 850,
      purchaseDate: new Date('2020-08-10'),
      assignedTasks: ['Aplicación de agroquímicos']
    }
  ];

  getAll(): Observable<Machinery[]> {
    return of(this.machineryList);
  }

  getById(id: string): Observable<Machinery | undefined> {
    const machinery = this.machineryList.find(m => m.id === id);
    return of(machinery ? { ...machinery } : undefined);
  }

  create(machinery: Machinery): Observable<Machinery> {
    const newMachinery = { ...machinery, id: machinery.id ?? crypto.randomUUID() };
    this.machineryList.push(newMachinery);
    return of(newMachinery);
  }

  update(machinery: Machinery): Observable<Machinery> {
    const index = this.machineryList.findIndex(m => m.id === machinery.id);
    if (index !== -1) {
      this.machineryList[index] = { ...machinery };
    }
    return of(machinery);
  }

  delete(id: string): Observable<void> {
    this.machineryList = this.machineryList.filter(m => m.id !== id);
    return of(void 0);
  }

  search(term: string): Observable<Machinery[]> {
    const lower = term.toLowerCase();
    return of(
      this.machineryList.filter(m =>
        m.name.toLowerCase().includes(lower) ||
        m.brand.toLowerCase().includes(lower) ||
        m.model.toLowerCase().includes(lower) ||
        m.id.toLowerCase() === lower
      )
    );
  }

  getReport(type: 'status' | 'usage' | 'tasks'): Observable<any[]> {
    if (type === 'status') {
      return of(
        this.machineryList.map(m => ({
          machinery: m.name,
          status: m.status
        }))
      );
    }

    if (type === 'usage') {
      return of(
        this.machineryList.map(m => ({
          machinery: m.name,
          hoursUsed: m.hoursUsed,
          purchaseDate: m.purchaseDate
        }))
      );
    }

    if (type === 'tasks') {
      return of(
        this.machineryList.map(m => ({
          machinery: m.name,
          assignedTasks: m.assignedTasks
        }))
      );
    }

    return of([]);
  }
}