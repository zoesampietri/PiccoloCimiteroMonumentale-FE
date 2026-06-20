import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//servizi che mi servono per l'autenticazione di un amministratore 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/lavoratori/amministratore';
  private codice_fiscale: string = '';
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {   //metodo che mi dice se l'amministratore è loggato o meno
    return this.loggedIn;
  }

  getCf(): string {     //metodo che mi restituisce il codice fiscale dell'amministratore loggato
    return this.codice_fiscale;
  }

  login(mail: string, password: string): Observable<boolean> {
    // Passiamo la mail e la password nel corpo della richiesta POST al backend. 
    // Il backend restituirà un oggetto utente se le credenziali sono corrette, altrimenti restituirà un errore 404.
    return this.http.post<any>(`${this.apiUrl}`, { mail: mail, password: password }).pipe(
      map(user => {
        // Il backend restituisce un singolo oggetto utente se trovato
        if (user) {
          this.loggedIn = true;
          this.codice_fiscale = user.codiceFiscale; // Salva il codice fiscale
          console.log('Login effettuato! CF:', this.codice_fiscale); // Log del codice fiscale per il debug
          return true;
        }
        // se non trova l'utente, ritorna false
        return false;
      }),
      catchError(error => {
        // Se il backend risponde con 404 (non esiste l'amministratore), entriamo qui
        console.error('Errore durante il login o utente non trovato:', error);   // Log dell'errore per il debug
        alert('Credenziali errate o utente non trovato.');  // Mostra un alert all'utente
        this.loggedIn = false;
        return of(false); 
      })
    );
  }


  logout(): void {
    this.loggedIn = false;
    this.codice_fiscale = '';
  }
}
