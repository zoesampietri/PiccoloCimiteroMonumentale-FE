import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ServiziService } from '../../service/servizi.service';
import { ServizioEntity } from '../../modelli/servizio.model';
import { lastValueFrom } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import {FormComponent} from './form';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface ServizioFoto extends ServizioEntity {
  fotoUrl?: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  servizi: ServizioFoto[] = []; // Array per memorizzare i servizi recuperati dal backend

  constructor(private serviziService: ServiziService, private router: Router, private authService: AuthService) {}
  readonly dialog = inject(Dialog);

  async ngOnInit() {    // Metodo chiamato quando il componente viene inizializzato, carica la lista dei defunti
    await this.loadServizi();
  }

   // Permette al ciclo @for dell'HTML di leggere 'dataSource'
  get dataSource(): ServizioFoto[] {
    return this.servizi;
  }

  async loadServizi(): Promise<void> {   // Metodo che carica la lista dei defunti dal servizio DefuntoEntityServic, chiamata dal metodo ngOnInit
    this.servizi=await lastValueFrom(this.serviziService.getAllServizi());
    for (let servizio of this.servizi) {
      if (servizio.nome === "Servizi marmisti") {
        servizio.fotoUrl = 'julia-kadel-Lie2dac88yY-unsplash.jpg';
      }
      if (servizio.nome === "Tumulazione") {
        servizio.fotoUrl = 'Screenshot 2026-04-14 101633.png';
      }
      if (servizio.nome === "Illuminazione votiva") {
        servizio.fotoUrl = 'eli-solitas-q6e4zwgtUcM-unsplash.jpg';
      }
      if (servizio.nome === "Inumazione") {
        servizio.fotoUrl = 'waldemar-brandt-jeTlob-Wv0M-unsplash.jpg';
      }
      if (servizio.nome === "Omaggi floreali") {
        servizio.fotoUrl = 'strauss-western-5a3eFHcGl9U-unsplash.jpg';
      }
      if (servizio.nome === "Affitto Sala") {
        servizio.fotoUrl = 'pexels-jonas-horsch-102497290-36378379.jpg';
      }
      if (servizio.nome === "Cremazione") {
        servizio.fotoUrl = 'andrei-r-popescu--wxTHHFpB1E-unsplash.jpg';
      }
      if (servizio.nome === "Camera ardente") {
        servizio.fotoUrl = 'kaja-sariwating-AU1RwsIjuLg-unsplash.jpg';
      }
      if (servizio.nome === "Esumazione") {
        servizio.fotoUrl = 'michael-pointner-YuMTdck2vK8-unsplash.jpg';
      }
      if (servizio.nome === "Ossario") {
        servizio.fotoUrl = 'sasha-matveeva-K87w2adu3ho-unsplash-Ritocco.png';
      }
    }

  }

   // Metodo attivato quando l'utente clicca per scegliere/prenotare il servizio
  selezionaServizio(servizio: ServizioFoto): void {
    console.log('Servizio selezionato per la prenotazione:', servizio);
    if (this.authService.isLoggedIn() === 'concessionario') {
      const dialogRef = this.dialog.open(FormComponent, { data: servizio });   // Apre la finestra di dialogo passando come dati l'oggetto defunto se presente, altrimenti passa null
      dialogRef.closed.subscribe(result => {  // Si iscrive all'evento closed della finestra di dialogo, che viene emesso quando la finestra viene chiusa. Quando la finestra viene chiusa, ricarica la lista dei defunti
        console.log('The dialog was closed');
        this.router.navigate(['/servizipersonali']); 
      });
    }
    else {
      console.log('Devi essere loggato come concessionario per prenotare un servizio.');
      alert('Fai login come concessionario per prenotare un servizio.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });  // Naviga alla pagina di login se l'utente non è loggato come concessionario
    }   
  }
}
