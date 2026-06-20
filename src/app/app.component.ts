import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

// Questo file serve per configurare il componente principale dell'applicazione Angular. è il contenitore di tutto dove poi su 
//<router-outlet> nel file html corrispondente verrano caricati i componenti a seconda dell'url che l'utente diggita.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
