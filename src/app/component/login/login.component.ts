import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, // importa direttive comuni come ngIf e ngFor
    FormsModule,  // importa il modulo per la gestione dei form ngModel legame tra campi del form e proprietà del componente
    RouterModule  // importa il modulo per la gestione della navigazione tra le pagine, ho la possibilità di cambiare url.
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {} // Inietta il servizio AuthService e il Router per la navigazione tra le pagine

  onSubmit() {    // Metodo chiamato quando l'utente invia il form di login
    this.authService.login(this.mail, this.password).subscribe(isValid => {  // Chiama il metodo login del servizio AuthService e si iscrive all'Observable restituito
      if (isValid) {
        console.log('Login effettuato! CF:', this.authService.getCf());
        this.router.navigate(['/dashboardadmin']); // Naviga alla pagina dashboardadmin se il login è valido
      } else {
        console.log('Credenziali errate');
      }
    });
  }
}
