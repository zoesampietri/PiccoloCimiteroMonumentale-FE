import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefuntoEntity } from '../modelli/defunto-entity.model';

// Servizio per gestire le operazioni CRUD sui DefuntoEntity. Tutte le volte che intergagisco con il backend per sapere qualcosa
// sui defunti, devo passare da questo servizio. Questo servizio è iniettato nei componenti che ne hanno bisogno.

@Injectable({providedIn: 'root'})
export class DefuntoEntityService {
  private apiUrl = '/api/defunti';  // URL dell'API per i DefuntoEntity, la prima del url è stata definita nel file proxy.conf.json

  constructor(private http: HttpClient) {}  

  getAllDefunti(): Observable<DefuntoEntity[]> {
    return this.http.get<DefuntoEntity[]>(this.apiUrl);   //get a /app/defunti ritorna un array di DefuntoEntity, quindi il tipo di ritorno è Observable<DefuntoEntity[]>
  }

  getDefuntoById(id: string): Observable<DefuntoEntity> {
    return this.http.get<DefuntoEntity>(`${this.apiUrl}/${id}`); //get a /app/defunti/:id ritorna un singolo DefuntoEntity, quindi il tipo di ritorno è Observable<DefuntoEntity>
  }

  getDefuntiBySettore(idSettore: string): Observable<DefuntoEntity[]> {
    return this.http.get<DefuntoEntity[]>(`${this.apiUrl}/settore/${idSettore}`); //get a /app/defunti/settore/:idSettore ritorna un array di DefuntoEntity, quindi il tipo di ritorno è Observable<DefuntoEntity[]>
  }

  getDefuntiByNomeCognome(nome: string, cognome: string): Observable<DefuntoEntity[]> {
    return this.http.get<DefuntoEntity[]>(`${this.apiUrl}/search?nome=${nome}&cognome=${cognome}`); //get a /app/defunti/search?nome=...&cognome=... ritorna un array di DefuntoEntity, quindi il tipo di ritorno è Observable<DefuntoEntity[]>
  }

  createDefunto(entity: DefuntoEntity): Observable<DefuntoEntity> {
    return this.http.post<DefuntoEntity>(this.apiUrl, entity);  //post a /app/defunti ritorna il DefuntoEntity appena creato, quindi il tipo di ritorno è Observable<DefuntoEntity>
  }

  updateDefunto(id: string, entity: DefuntoEntity): Observable<DefuntoEntity> {
    return this.http.put<DefuntoEntity>(`${this.apiUrl}/${id}`, entity);    //put a /app/defunti/:id ritorna il DefuntoEntity appena aggiornato, quindi il tipo di ritorno è Observable<DefuntoEntity>
  }

  deleteDefunto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);    //delete a /app/defunti/:id ritorna void, quindi il tipo di ritorno è Observable<void>
  }


}
