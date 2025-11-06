import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Plot } from '../../shared/models/plot.model';

@Injectable({ providedIn: 'root' })
export class PlotServiceMock {
  private plots: Plot[] = [
    {
      id: crypto.randomUUID(),
      name: 'Lote Norte',
      cadastralNumber: 'CN-001',
      area: 12.5,
      location: 'Sector A',
      status: 'planted',
      tasks: [
        {
          type: 'planting',
          date: new Date('2025-10-01'),
          inputs: [
            { name: 'Maíz híbrido', type: 'seed', quantity: 50, unit: 'kg' },
            { name: 'Fertilizante NPK', type: 'fertilizer', quantity: 20, unit: 'kg' }
          ]
        }
      ],
      rainfall: [
        { date: new Date('2025-10-03'), millimeters: 12 },
        { date: new Date('2025-10-10'), millimeters: 8 }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Lote Sur',
      cadastralNumber: 'CN-002',
      area: 8.0,
      location: 'Sector B',
      status: 'free',
      tasks: [],
      rainfall: []
    }
  ];

  getAll(): Observable<Plot[]> {
    return of(this.plots);
  }

  getById(id: string): Observable<Plot | undefined> {
    const plot = this.plots.find(p => p.id === id);
    return of(plot ? { ...plot } : undefined);
  }

  create(plot: Plot): Observable<Plot> {
    const newPlot = { ...plot, id: plot.id ?? crypto.randomUUID() };
    this.plots.push(newPlot);
    return of(newPlot);
  }

  update(plot: Plot): Observable<Plot> {
    const index = this.plots.findIndex(p => p.id === plot.id);
    if (index !== -1) {
      this.plots[index] = { ...plot };
    }
    return of(plot);
  }

  delete(id: string): Observable<void> {
    this.plots = this.plots.filter(p => p.id !== id);
    return of(void 0);
  }

  search(term: string): Observable<Plot[]> {
    const lower = term.toLowerCase();
    return of(
      this.plots.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.cadastralNumber.toLowerCase().includes(lower) ||
        p.id.toLowerCase() === lower
      )
    );
  }

  getReport(type: 'inputs' | 'rainfall' | 'yield'): Observable<any[]> {
    if (type === 'inputs') {
      return of(
        this.plots.flatMap(p =>
          p.tasks.flatMap(t =>
            t.inputs.map(i => ({
              plot: p.name,
              input: i.name,
              type: i.type,
              quantity: i.quantity,
              unit: i.unit,
              date: t.date
            }))
          )
        )
      );
    }

    if (type === 'rainfall') {
      return of(
        this.plots.map(p => ({
          plot: p.name,
          totalRainfall: p.rainfall.reduce((acc, r) => acc + r.millimeters, 0)
        }))
      );
    }

    if (type === 'yield') {
      return of(
        this.plots.map(p => ({
          plot: p.name,
          status: p.status,
          area: p.area,
          lastHarvest: p.tasks
            .filter(t => t.type === 'harvesting')
            .map(t => t.date)
            .sort((a, b) => b.getTime() - a.getTime())[0] ?? null
        }))
      );
    }

    return of([]);
  }
}