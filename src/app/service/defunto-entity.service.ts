import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefuntoEntity } from '../modelli/defunto-entity.model';
@Injectable({
  providedIn: 'root'
})
export class DefuntoEntityService {

  private apiUrl = '/api/defunto-entities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DefuntoEntity[]> {
    return this.http.get<DefuntoEntity[]>(this.apiUrl);
  }

  getById(id: string): Observable<DefuntoEntity> {
    return this.http.get<DefuntoEntity>(`${this.apiUrl}/${id}`);
  }

  create(entity: DefuntoEntity): Observable<DefuntoEntity> {
    return this.http.post<DefuntoEntity>(this.apiUrl, entity);
  }

  update(id: string, entity: DefuntoEntity): Observable<DefuntoEntity> {
    return this.http.put<DefuntoEntity>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
