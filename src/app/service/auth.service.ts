import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/lavoratori/amministratore';
  private cf: string = '';
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCf(): string {
    return this.cf;
  }

  login(mail: string, password: string): Observable<boolean> {
    // Passiamo la mail come query parameter (?email=...)
    return this.http.post<any>(`${this.apiUrl}`, { mail: mail, password: password }).pipe(
      map(user => {
        // Il backend restituisce un singolo oggetto utente se trovato
        if (user) {
          this.loggedIn = true;
          this.cf = user.cf; // Salva il codice fiscale
          return true;
        }
        
        this.loggedIn = false;
        return false;
      }),
      catchError(error => {
        // Se il backend risponde con 404 (Runtime NotFound), entriamo qui
        console.error('Errore durante il login o utente non trovato:', error);
        this.loggedIn = false;
        return of(false); 
      })
    );
  }


  logout(): void {
    this.loggedIn = false;
    this.cf = '';
  }
}
