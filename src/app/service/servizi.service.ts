import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ServizioEntity} from '../modelli/servizio.model';

// Servizio per gestire le operazioni sui ServizioEntity. Tutte le volte che intergagisco con il backend per sapere qualcosa
// sui servizi, devo passare da questo servizio. Questo servizio è iniettato nei componenti che ne hanno bisogno.

@Injectable({providedIn: 'root'})
export class ServiziService {
  private apiUrl = '/api/servizi';  // URL dell'API per i Servizi, la prima del url è stata definita nel file proxy.conf.json

  constructor(private http: HttpClient) {}  

  getAllServizi(): Observable<ServizioEntity[]> {
    return this.http.get<ServizioEntity[]>(this.apiUrl);   //get a /app/servizi ritorna un array di ServizioEntity, quindi il tipo di ritorno è Observable<ServizioEntity[]>
  }

  getServizioByNome(nome: string): Observable<ServizioEntity> {
    return this.http.get<ServizioEntity>(`${this.apiUrl}/${nome}`); //get a /app/servizi/:nome ritorna un singolo ServizioEntity, quindi il tipo di ritorno è Observable<ServizioEntity>
  }
}
