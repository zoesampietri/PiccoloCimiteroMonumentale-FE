import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrenotazioneEntity} from "../../modelli/prenotazione.model";
import {PrenotazioneEntityService} from "../../service/prenotazione.service";
import { ServiziService } from "../../service/servizi.service";
import {AuthService} from "../../service/auth.service";
import { firstValueFrom } from 'rxjs';
import { FormComponent } from './form';
import { Dialog } from '@angular/cdk/dialog';

interface PrenotazioneAzioni{
  prenotazione: PrenotazioneEntity;
  durata: string;
  modificaPrenotazione: boolean;
  rinnovaPrenotazione: boolean;
  annullaPrenotazione: boolean;
  pagaPrenotazione: boolean;
}

@Component({
  selector: 'app-servizipersonali',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './servizipersonali.component.html',
  styleUrl: './servizipersonali.component.css'
})
export class ServizipersonaliComponent implements OnInit {
  prenotazioni: PrenotazioneAzioni[] = []; // Array per memorizzare le prenotazioni recuperate dal backend
  cf: string = ""; // Variabile per memorizzare il codice fiscale dell'utente loggato
  nome: string = ""; // Variabile per memorizzare il nome dell'utente loggato
  cognome: string = ""; // Variabile per memorizzare il cognome dell'utente loggato

  constructor(private prenotazioneService: PrenotazioneEntityService, private serviziService: ServiziService, private authService: AuthService) {}

  readonly dialog = inject(Dialog);
  
  async loadPrenotazioni(): Promise<void> {
    try {
      const result = await firstValueFrom(this.prenotazioneService.getPrenotazioneConcessionario(this.cf));
      const lista = Array.isArray(result) ? result : [result];
      
      // Svuota l'array prima di caricarlo per evitare duplicati in caso di ricaricamento
      this.prenotazioni = []; 
      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per confronti di data più precisi

      for (const p of lista) {
        let azioni: PrenotazioneAzioni = {
          prenotazione: p,
          durata: '',
          modificaPrenotazione: true, 
          rinnovaPrenotazione: true, 
          annullaPrenotazione: true,
          pagaPrenotazione: p.stato_pagamento !== 'Saldato' // Più pulito
        };

        // 1. Converti la data stringa del backend in oggetto Date
        let dataInizio = p.data ? new Date(p.data) : null;
        dataInizio?.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per confronti di data più precisi

        if (dataInizio && p.id.nome_servizio) {
          // 2. Recupera il servizio per calcolare la durata
          const servizio = await firstValueFrom(this.serviziService.getServizioByNome(p.id.nome_servizio));
          
          if (!servizio) {
            console.error(`Servizio non trovato per nome: ${p.id.nome_servizio}`);
            azioni.modificaPrenotazione = false;
            azioni.rinnovaPrenotazione = false;
            azioni.annullaPrenotazione = false;
            this.prenotazioni.push(azioni);
            continue; // Salta questa iterazione se il servizio non è trovato
          }
          azioni.durata = servizio.durata || '';
          let durata = servizio.durata?.split(' ') || ['0', 'HOUR'];
          let numeroDurata = parseInt(durata[0]) || 0;
          let tipoDurata = durata[1];

          // Calcola i giorni di durata
          let giorniDurata = 0;
          if (tipoDurata === 'DAY') giorniDurata = numeroDurata;
          else if (tipoDurata === 'YEAR') giorniDurata = numeroDurata * 365;
          // Se 'H' (ore), i giorni rimangono 0

          // 3. Calcola la data esatta di scadenza del servizio
          const dataScadenza = new Date(dataInizio.getTime() + giorniDurata * 24 * 60 * 60 * 1000);
          dataScadenza.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per confronti di data più precisi

          // se la l'inizio del servizio è nel futuro posso modificare i termini altrimenti no
          if (dataInizio >= oggi) {
            azioni.modificaPrenotazione = true;
          }
          else {
            azioni.modificaPrenotazione = false;
          }

          // se la data di scadenza del servizio è nel passato posso rinnovare la prenotazione altrimenti no
          if (dataScadenza < oggi) {
            azioni.rinnovaPrenotazione = true;
          } else {
            azioni.rinnovaPrenotazione = false;
          }

          if (dataInizio < oggi && dataScadenza > oggi) {
            azioni.annullaPrenotazione = false;
          } else {
            azioni.annullaPrenotazione = true;
          }
        } else {
          azioni.modificaPrenotazione = false;
          azioni.rinnovaPrenotazione = false;
          azioni.annullaPrenotazione = false;
        }

        this.prenotazioni.push(azioni);
      }
      
      console.log('Prenotazioni caricate con successo:', this.prenotazioni);
    } catch (error) {
      console.error('Errore durante il caricamento delle prenotazioni:', error);
      this.prenotazioni = []; 
    }
  }


  ngOnInit(): void {
    this.cf = this.authService.getCf();
    this.nome = this.authService.getNome();
    this.cognome = this.authService.getCognome();
    this.loadPrenotazioni();
  }

  immagine(nomeServizio: string): string {
    if (nomeServizio === "Servizi marmisti") {
      return 'julia-kadel-Lie2dac88yY-unsplash.jpg';
    }
    if (nomeServizio === "Tumulazione") {
      return 'Screenshot 2026-04-14 101633.png';
    }
    if (nomeServizio === "Illuminazione votiva") {
      return 'eli-solitas-q6e4zwgtUcM-unsplash.jpg';
    }
    
    if (nomeServizio === "Inumazione") {
      return 'waldemar-brandt-jeTlob-Wv0M-unsplash.jpg';
    }
    if (nomeServizio === "Omaggi floreali") {
      return 'strauss-western-5a3eFHcGl9U-unsplash.jpg';
    }
    if (nomeServizio === "Affitto Sala") {
      return 'pexels-jonas-horsch-102497290-36378379.jpg';
    }
    if (nomeServizio === "Cremazione") {
      return 'andrei-r-popescu--wxTHHFpB1E-unsplash.jpg';
    }
    if (nomeServizio === "Camera ardente") {
      return 'kaja-sariwating-AU1RwsIjuLg-unsplash.jpg';
    }
    if (nomeServizio === "Esumazione") {
      return 'michael-pointner-YuMTdck2vK8-unsplash.jpg';
    }
    if (nomeServizio === "Ossario") {
      return 'sasha-matveeva-K87w2adu3ho-unsplash-Ritocco.png';
    }
    return 'Login.svg'; 
  }

  modificaPrenotazione(prenotazione: PrenotazioneEntity): void {
    console.log('Aperta modifica per:', prenotazione);
    const dialogRef = this.dialog.open(FormComponent, { data: { prenotazione , isRinnovo: false } });   // Apre la finestra di dialogo passando come dati l'oggetto defunto se presente, altrimenti passa null
    dialogRef.closed.subscribe(result => {  // Si iscrive all'evento closed della finestra di dialogo, che viene emesso quando la finestra viene chiusa. Quando la finestra viene chiusa, ricarica la lista dei defunti
      console.log('The dialog was closed');
      this.loadPrenotazioni();
    });
  }

  rinnovaPrenotazione(prenotazione: PrenotazioneEntity): void {
    console.log('Aperta rinnovo per:', prenotazione);
    const dialogRef = this.dialog.open(FormComponent, { data: { prenotazione , isRinnovo: true } });   // Apre la finestra di dialogo passando come dati l'oggetto defunto se presente, altrimenti passa null
    dialogRef.closed.subscribe(result => {  // Si iscrive all'evento closed della finestra di dialogo, che viene emesso quando la finestra viene chiusa. Quando la finestra viene chiusa, ricarica la lista dei defunti
      console.log('The dialog was closed');
      this.loadPrenotazioni();
    });
  }

  eliminaPrenotazione(prenotazione: PrenotazioneEntity): void {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      this.prenotazioneService.deletePrenotazione(prenotazione.id).subscribe({
        next: () => {
          console.log('Prenotazione eliminata con successo');
          this.loadPrenotazioni(); // Ricarica le prenotazioni dopo l'eliminazione
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione della prenotazione:', err);
        }
      });
    }
  }

  pagaPrenotazione(prenotazione: PrenotazioneEntity): void {
    this.prenotazioneService.pagaPrenotazione(prenotazione.id, this.cf).subscribe({
      next: () => {
        console.log('Pagamento effettuato con successo');
        this.loadPrenotazioni(); // Ricarica le prenotazioni dopo il pagamento
      },
      error: (err) => {
        console.error('Errore durante il pagamento della prenotazione:', err);
      }
    });
  }
}
