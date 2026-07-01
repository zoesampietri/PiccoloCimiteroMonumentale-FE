import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DefuntoEntity} from '../../modelli/defunto-entity.model';
import {SepolturaEntity} from '../../modelli/sepolture.model';
import {SepoltureService} from '../../service/sepolure.service';
import {DefuntoEntityService} from '../../service/defunto-entity.service';
import {CommonModule} from '@angular/common';

interface Sepoltura {
  sepoltura: SepolturaEntity | null;
  defunti: DefuntoEntity[];  
}

interface ColoreSepoltura{
  sepoltura: SepolturaEntity;
  colore: string;
}

@Component({
  selector: 'app-mappa',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.css']
})
export class MappaComponent implements OnInit {
  private sepoltureService = inject(SepoltureService);
  private defuntoEntityService = inject(DefuntoEntityService);

  // Memorizza il settore attualmente selezionato
  settoreSelezionato: Sepoltura | null = null;

  // Memorizzo tutte le sepolture per poterle visualizzare sulla mappa
  tuttesepolture: ColoreSepoltura[] = [];

  //Nome e/o cognome del defunto selezionato
  testoCerca: string = '';
  defuntiTrovati: DefuntoEntity[] = [];
  indiceCorrente: number = 0; // Indice per navigare tra i defunti trovati

  ngOnInit(): void {
    // Recupera tutte le sepolture al caricamento del componente
    this.sepoltureService.getAllSepolture().subscribe({
      next: (datiSepolture: SepolturaEntity[]) => {
        this.tuttesepolture = datiSepolture.map(sep => ({ sepoltura: sep, colore: this.getColoreSepoltura(sep.stato) }));
      },
      error: (err) => console.error("Errore caricamento sepolture:", err)
    });
  }

  private getColoreSepoltura(stato: string): string {
    if (!stato) {
      return '#bdc3c7'; // Colore di default se lo stato non è definito
    }
    switch (stato.toLowerCase()) {
      case 'libero':
        return '#2ecc71';
      case 'occupato parzialmente':
        return '#f8f54d';
      case 'occupato':
        return '#ff741e';
      default:
        return '#bdc3c7'; // Colore di default per stati non previsti
    }
  }

  public getColoreSepolturaById(id: string): string {
    const settore = id.charAt(0); // Prende il primo carattere dell'id per determinare il settore
    const numero = id.slice(1); // Prende il resto dell'id per determinare il numero della sepoltura
    const sepoltura = this.tuttesepolture.find(s => s.sepoltura.id.id === settore && s.sepoltura.id.numero === numero);
    return sepoltura ? sepoltura.colore : '#bdc3c7'; // Colore di default se non trovato
  }

  // Funzione chiamata al click sulla mappa, trovo effettivamente il settore selezionato e recupero i dati
  selezionaSettore(idSettore: string): void {
    // Resetta lo stato precedente per mostrare un caricamento pulito
    this.settoreSelezionato = {
      sepoltura: null,
      defunti: [],
    };

    // Recupera la sepoltura. Il metodo è asincrono, quindi uso subscribe e next per gestire la risposta. 
    // ... operatore spread per mantenere lo stato precedente di settoreSelezionato e aggiorna solo sepoltura.
    this.sepoltureService.getSepoluraById(idSettore).subscribe({
      next: (datiSepoltura) => {
        this.settoreSelezionato = {
          ...this.settoreSelezionato!,
          sepoltura: datiSepoltura || null
        };
      },
      error: (err) => console.error("Errore caricamento sepoltura:", err)
    });

    // Recupera i defunti
    this.defuntoEntityService.getDefuntiBySettore(idSettore).subscribe({
      next: (elencoDefunti) => {
        this.settoreSelezionato = {
          ...this.settoreSelezionato!,
          defunti: elencoDefunti || []
        };
      },
      error: (err) => console.error("Errore caricamento defunti:", err)
    });
  }

  // Aggiungi questo metodo in fondo alla classe MappaComponent
  public isSelezionato(settore: string, numero: string): boolean {
    if (!this.settoreSelezionato || !this.settoreSelezionato.sepoltura) {
      return false;
    }
    const sepAttiva = this.settoreSelezionato.sepoltura.id;
    return sepAttiva.id === settore && sepAttiva.numero === numero;
  }

  cercaSepoltura(): void {
    const testo = this.testoCerca.trim();
    if (!testo) return;

    const parti = testo.split(/\s+/);
    const nome = parti[0];
    const cognome = parti.slice(1).join(' ') || '';

    // Reset dello stato iniziale
    this.defuntiTrovati = [];
    let chiamateInCorso = 2; 

    // Funzione di supporto per gestire i dati in modo sicuro quando arrivano
    const gestisciRisultati = (nuoviDefunti: DefuntoEntity[] | null) => {
      chiamateInCorso--;

      if (nuoviDefunti && nuoviDefunti.length > 0) {
        // Uniamo i nuovi dati a quelli già trovati
        const listaAggiornata = [...this.defuntiTrovati, ...nuoviDefunti];

        // Filtriamo i dati validi e rimuoviamo i duplicati per ID
        this.defuntiTrovati = listaAggiornata
          .filter(d => d && d.settoreSepoltura && d.idSepoltura)
          .filter((value, index, self) => self.findIndex(t => t.id === value.id) === index);
      }

      // Solo quando ENTRAMBE le chiamate hanno risposto (o sono fallite) aggiorniamo la mappa
      if (chiamateInCorso === 0) {
        console.log('Tutte le ricerche completate. Risultati:', this.defuntiTrovati);
        
        if (this.defuntiTrovati.length > 0) {
          this.indiceCorrente = 0;
          const primo = this.defuntiTrovati[0];
          this.selezionaSettore(`${primo.settoreSepoltura}${primo.idSepoltura}`);
        }
      }
    };

    // Prima chiamata: Nome + Cognome
    this.defuntoEntityService.getDefuntiByNomeCognome(nome, cognome).subscribe({
      next: (risultatoA) => gestisciRisultati(risultatoA),
      error: (err) => {
        console.error(`Errore ricerca per Nome: ${nome}, Cognome: ${cognome}`, err);
        gestisciRisultati([]); // Mandiamo array vuoto per scalare il contatore
      }
    });

    // Seconda chiamata: Cognome + Nome (eseguita solo se c'è almeno un cognome inserito)
    if (cognome) {
      this.defuntoEntityService.getDefuntiByNomeCognome(cognome, nome).subscribe({
        next: (risultatoB) => gestisciRisultati(risultatoB),
        error: (err) => {
          console.error(`Errore ricerca per Cognome: ${cognome}, Nome: ${nome}`, err);
          gestisciRisultati([]);
        }
      });
    } else {
      // Se non c'è una seconda parola, scaliamo subito il contatore della seconda chiamata
      chiamateInCorso--; 
    }
  }


  defuntoSuccessivo(): void {
    if (this.defuntiTrovati.length <= 1) return;

    if (this.indiceCorrente < this.defuntiTrovati.length - 1) {
      this.indiceCorrente++; // Passa al prossimo
    } else {
      this.indiceCorrente = 0; // Ricomincia dal primo se era arrivato in fondo
    }

    let settore= this.defuntiTrovati[this.indiceCorrente].settoreSepoltura || '' ;
    let sepoltura = settore.concat(String(this.defuntiTrovati[this.indiceCorrente].idSepoltura) || '');

    
    this.selezionaSettore(sepoltura);
  }

  immagine(tipologia: string): string {
    if (tipologia === "tumulazione") {
      return 'Screenshot 2026-04-14 101633.png';
    }
    if (tipologia === "inumazione") {
      return 'waldemar-brandt-jeTlob-Wv0M-unsplash.jpg';
    }
     if (tipologia === "ossario") {
      return 'sasha-matveeva-K87w2adu3ho-unsplash-Ritocco.png';
    }
    return 'Logo.svg';
  }

  settore(id: string): string{
    if (id==="A") return "Ostro";
    if (id==="B") return "Libeccio";
    if (id==="C") return "Maestrale";
    if (id==="D") return "Grecale";
    if (id==="E") return "Scirocco";
    return "";
  }
}