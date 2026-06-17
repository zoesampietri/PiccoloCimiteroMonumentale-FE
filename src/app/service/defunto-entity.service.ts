import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefuntoEntity } from '../modelli/defunto-entity.model';

@Injectable({providedIn: 'root'})
export class DefuntoEntityService {
  private apiUrl = '/api/defunti';

  constructor(private http: HttpClient) {}

  getAllDefunti(): Observable<DefuntoEntity[]> {
    return this.http.get<DefuntoEntity[]>(this.apiUrl);
  }

  getDefuntoById(id: string): Observable<DefuntoEntity> {
    return this.http.get<DefuntoEntity>(`${this.apiUrl}/${id}`);
  }

  createDefunto(entity: DefuntoEntity): Observable<DefuntoEntity> {
    return this.http.post<DefuntoEntity>(this.apiUrl, entity);
  }

  updateDefunto(id: string, entity: DefuntoEntity): Observable<DefuntoEntity> {
    return this.http.put<DefuntoEntity>(`${this.apiUrl}/${id}`, entity);
  }

  deleteDefunto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
