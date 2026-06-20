import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {DefuntoEntity} from '../../modelli/defunto-entity.model';
import {DefuntoEntityService} from '../../service/defunto-entity.service';
import { lastValueFrom } from 'rxjs';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service'; 

@Component(
  {
    selector: 'dialog-add-entity',
    templateUrl: './dialog-add-entity.html',
    styleUrl: './dialog-add-entity.css',
    standalone: true,
    imports: [CommonModule, FormsModule]
  }
)
export class DialogAddEntity implements OnInit {
  readonly dialogRef = inject(DialogRef<DialogAddEntity>);
  id: string | null = null;
  nome: string='';
  cognome: string='';
  sesso: string='';
  codiceFiscale: string = '';
  dataNascita: Date | undefined = undefined;
  dataMorte: Date | undefined = undefined;
  luogoMorte: string = '';
  luogoNascita: string = '';
  statoCivile: string = '';
  causaDecesso: string = '';
  indirizzoUltimaResidenza: string = '';
  epitaffio: string = '';
  settoreSepoltura: string = '';
  idSepoltura: string = '';
  dataSepoltura: Date | undefined = undefined;
  amministratoreResponsabile: string = '';

  onNoClick(): void {   // Metodo chiamato quando l'utente clicca su "Annulla" nella finestra di dialogo, chiude la finestra senza salvare i dati
    this.dialogRef.close();
  }

  constructor(private defuntoEntityService: DefuntoEntityService, private authService: AuthService, @Inject(DIALOG_DATA) public data: DefuntoEntity | null) {}

  ngOnInit(): void {  // Metodo chiamato quando il componente viene inizializzato, se 'data' esiste, significa che l'utente ha cliccato su "Modifica" e quindi i campi del form vengono popolati con i dati del defunto da modificare
    const cf=this.authService.getCf();
    console.log('CF dell\'amministratore responsabile:', cf);

    this.amministratoreResponsabile = cf; // Imposta l'amministratore responsabile con il CF dell'utente loggato

    // Se 'data' esiste, significa che l'utente ha cliccato su "Modifica"
    if (this.data) {
      this.id = this.data.id || null; // Salva l'id se presente nel tuo modello
      this.nome = this.data.nome || '';
      this.cognome = this.data.cognome || '';
      this.sesso = this.data.sesso || '';
      this.codiceFiscale = this.data.codiceFiscale || '';
      this.dataNascita = this.data.dataNascita;
      this.dataMorte = this.data.dataMorte;
      this.luogoMorte = this.data.luogoMorte || '';
      this.luogoNascita = this.data.luogoNascita || '';
      this.statoCivile = this.data.statoCivile || '';
      this.causaDecesso = this.data.causaDecesso || '';
      this.indirizzoUltimaResidenza = this.data.indirizzoUltimaResidenza || '';
      this.epitaffio = this.data.epitaffio || '';
      this.settoreSepoltura = this.data.settoreSepoltura || '';
      this.idSepoltura = this.data.idSepoltura || '';
      this.dataSepoltura = this.data.dataSepoltura;
      this.amministratoreResponsabile = this.data.amministratoreResponsabile || cf;
    }
  }

  async save(form: NgForm) {

    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return; 
    }

    let entity = new DefuntoEntity();
    if (this.id) {
      entity.id = this.id; 
    }
    entity.nome = this.nome;
    entity.cognome = this.cognome;
    entity.sesso = this.sesso;
    entity.codiceFiscale = this.codiceFiscale;
    entity.dataNascita = this.dataNascita;
    entity.dataMorte = this.dataMorte;
    entity.luogoMorte = this.luogoMorte;
    entity.luogoNascita = this.luogoNascita;
    entity.statoCivile = this.statoCivile;
    entity.causaDecesso = this.causaDecesso;
    entity.indirizzoUltimaResidenza = this.indirizzoUltimaResidenza;
    entity.epitaffio = this.epitaffio;
    entity.settoreSepoltura = this.settoreSepoltura;
    entity.idSepoltura = this.idSepoltura;
    entity.dataSepoltura = this.dataSepoltura;
    entity.amministratoreResponsabile = this.amministratoreResponsabile;

     // Scegli se fare una chiamata di UPDATE (put) o CREATE (post) in base alla presenza dell'ID
    if (this.id) {
      // Modifica questo metodo in base a come si chiama la funzione di update nel tuo service
      await lastValueFrom(this.defuntoEntityService.updateDefunto(this.id,entity)); 
    } else {
      await lastValueFrom(this.defuntoEntityService.createDefunto(entity));
    }
    this.dialogRef.close();
  }
}
