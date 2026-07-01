import { Component, HostListener } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';

// Questo file serve per configurare il componente principale dell'applicazione Angular. è il contenitore di tutto dove poi su 
//<router-outlet> nel file html corrispondente verrano caricati i componenti a seconda dell'url che l'utente diggita.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

   // Controlla lo stato della tendina (aperta/chiusa)
  isDropdownOpen = false;

  // Inverte lo stato quando si clicca sul pulsante
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Chiude la tendina quando si cambia pagina
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  // Chiude la tendina se l'utente clicca in un punto qualsiasi fuori dal menu
  @HostListener('document:click')
  clickOut() {
    this.closeDropdown();
  }
}
