import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SepolturaEntity } from '../modelli/sepolture.model';
import { DefuntoEntity } from '../modelli/defunto-entity.model';

// Servizio per gestire le operazioni CRUD sui DefuntoEntity. Tutte le volte che intergagisco con il backend per sapere qualcosa
// sui defunti, devo passare da questo servizio. Questo servizio è iniettato nei componenti che ne hanno bisogno.

@Injectable({providedIn: 'root'})
export class SepoltureService {
  private apiUrl = '/api/sepolture';  // URL dell'API per le Sepolture, la prima del url è stata definita nel file proxy.conf.json

  constructor(private http: HttpClient) {}  

  getAllSepolture(): Observable<SepolturaEntity[]> {
    return this.http.get<SepolturaEntity[]>(this.apiUrl);   //get a /app/sepolture ritorna un array di SepolturaEntity, quindi il tipo di ritorno è Observable<SepolturaEntity[]>
  }

  getSepoluraById(id: string): Observable<SepolturaEntity> {
    return this.http.get<SepolturaEntity>(`${this.apiUrl}/${id}`); //get a /app/sepolture/:id ritorna un singolo SepolturaEntity, quindi il tipo di ritorno è Observable<SepolturaEntity>
  }
}
