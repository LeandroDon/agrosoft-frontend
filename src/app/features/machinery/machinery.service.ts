import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Machinery } from './machinery.model';

@Injectable({
  providedIn: 'root'
})
export class MachineryService {
  private apiUrl = 'http://localhost:3000/api/machinery';

  constructor(private http: HttpClient) {}

  getMachinery(): Observable<Machinery[]> {
  return this.http.get<Machinery[]>(this.apiUrl);
}

  getMachine(id: string): Observable<Machinery> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}

  addMachine(machine: Omit<Machinery, 'id'>): Observable<Machinery> {
  return this.http.post<Machinery>(this.apiUrl, machine);
}

  updateMachine(id: string, machine: Partial<Machinery>): Observable<Machinery> {
  return this.http.put<Machinery>(`${this.apiUrl}/${id}`, machine);
}

  deleteMachine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}