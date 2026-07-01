import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrenotazioneEntity, PrenotazioneId } from '../modelli/prenotazione.model';

@Injectable({providedIn: 'root'})
export class PrenotazioneEntityService {
  private apiUrl = '/api/prenotazioni';  // URL dell'API per i PrenotazioneEntity, la prima del url è stata definita nel file proxy.conf.json

  constructor(private http: HttpClient) {}  

  getPrenotazioneConcessionario(id: string): Observable<PrenotazioneEntity> {
    return this.http.get<PrenotazioneEntity>(`${this.apiUrl}/${id}`); //get a /app/prenotazioni/:id ritorna un singolo PrenotazioneEntity, quindi il tipo di ritorno è Observable<PrenotazioneEntity>
  }

  createPrenotazione(entity: PrenotazioneEntity): Observable<PrenotazioneEntity> {
    return this.http.post<PrenotazioneEntity>(this.apiUrl, entity);  //post a /app/prenotazioni ritorna il PrenotazioneEntity appena creato, quindi il tipo di ritorno è Observable<PrenotazioneEntity>
  }

  updatePrenotazione(id: PrenotazioneId, entity: PrenotazioneEntity): Observable<PrenotazioneEntity> {
    return this.http.put<PrenotazioneEntity>(`${this.apiUrl}`, entity);    //put a /app/prenotazioni/:id ritorna il PrenotazioneEntity appena aggiornato, quindi il tipo di ritorno è Observable<PrenotazioneEntity>
  }

  deletePrenotazione(id: PrenotazioneId): Observable<void> {
    const nome_servizio: string = id.nome_servizio;
    const id_defunto: string = id.id_defunto;
    return this.http.delete<void>(`${this.apiUrl}/${nome_servizio}/${id_defunto}`);    //delete a /app/prenotazioni/:id ritorna void, quindi il tipo di ritorno è Observable<void>
  }
   
  pagaPrenotazione(id: PrenotazioneId, cf: string): Observable<PrenotazioneEntity> {
    return this.http.post<PrenotazioneEntity>(`${this.apiUrl}/paga`, { id, cf }); //post a /app/prenotazioni/paga/ ritorna il PrenotazioneEntity appena aggiornato, quindi il tipo di ritorno è Observable<PrenotazioneEntity>
  }
}
