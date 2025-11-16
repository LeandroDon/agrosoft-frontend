import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plot } from './plot.model';

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  private apiUrl = 'http://localhost:3000/api/plots';

  constructor(private http: HttpClient) {}

  getPlots(): Observable<Plot[]> {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(rawList => rawList.map(raw => ({
      ...raw,
      cadastralNumber: raw.cadastralNumber ?? raw.cadastralnumber ?? ''
    })))
  );
}

  getPlot(id: string): Observable<Plot> {
  return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
    map(raw => ({
      ...raw,
      cadastralNumber: raw.cadastralNumber ?? raw.cadastralnumber ?? ''
    }))
  );
}

  addPlot(plot: Omit<Plot, 'id'>): Observable<Plot> {
  return this.http.post<Plot>(this.apiUrl, plot);
}

  updatePlot(id: string, plot: Partial<Plot>): Observable<Plot> {
  return this.http.put<Plot>(`${this.apiUrl}/${id}`, plot);
}

  deletePlot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}