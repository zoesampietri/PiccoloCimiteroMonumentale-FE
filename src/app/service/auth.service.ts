import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//servizi che mi servono per l'autenticazione 

//posso gestire l'autenticazione di amministratori, che possono raggiungere la dashboard,
//  o l'autenticazione di un concessionario che può vedere i propri dati

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private codice_fiscale: string = '';
  private nome: string = '';
  private cognome: string = '';
  private stato: string = '';
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  isLoggedIn(): string {   //metodo che mi dice se l'amministratore è loggato o meno
    return this.stato;
  }

  getCf(): string {     //metodo che mi restituisce il codice fiscale dell'amministratore loggato
    return this.codice_fiscale;
  }

  getNome(): string {     //metodo che mi restituisce il nome dell'amministratore loggato
    return this.nome;
  }
  
  getCognome(): string {     //metodo che mi restituisce il cognome dell'amministratore loggato
    return this.cognome;
  }

  login(mail: string, password: string): Observable<boolean> {
    const payload = { mail: mail, password: password };

    // 1. Proviamo prima l'endpoint dell'Amministratore
    return this.http.post<any>(`/api/lavoratori/amministratore`, payload).pipe(
      map(user => {
        if (user) {
          this.loggedIn = true;
          this.codice_fiscale = user.codiceFiscale;
          this.nome = user.nome;
          this.cognome = user.cognome;
          this.stato = 'amministratore'; // Imposta lo stato specifico
          console.log('Login effettuato come Amministratore! CF:', this.codice_fiscale);
          return true;
        }
        return false;
      }),
      catchError(error => {
        // 2. Se fallisce (es. 404), proviamo l'endpoint del Concessionario
        console.log('Amministratore non trovato, provo come concessionario...');
        
        return this.http.post<any>(`/api/concessionari/login`, payload).pipe( // <-- Sostituisci con il tuo endpoint reale dei concessionari
          map(concessionario => {
            if (concessionario) {
              this.loggedIn = true;
              this.codice_fiscale = concessionario.codiceFiscale; // o il campo corretto restituito dal backend
              this.nome = concessionario.nome;
              this.cognome = concessionario.cognome;
              this.stato = 'concessionario'; // Imposta lo stato specifico
              console.log('Login effettuato come Concessionario! CF:', this.codice_fiscale);
              return true;
            }
            return false;
          }),
          catchError(errConcessionario => {
            // 3. Se falliscono entrambi, mostriamo l'errore definitivo
            console.error('Credenziali errate per entrambi i ruoli:', errConcessionario);
            alert('Credenziali errate o utente non trovato.');
            this.loggedIn = false;
            this.stato = '';
            this.codice_fiscale = '';
            this.nome = '';
            this.cognome = '';
            return of(false);
          })
        );
      })
    );
  }

  logout(): void {
    this.loggedIn = false;
    this.codice_fiscale = '';
    this.stato = '';
    this.nome = '';
    this.cognome = '';
  }
}
