import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {DefuntoEntity} from '../../modelli/defunto-entity.model';
import {DefuntoEntityService} from '../../service/defunto-entity.service';
import { lastValueFrom } from 'rxjs';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-lista-defunti',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule 
  ],
  templateUrl: './lista-defunti.component.html',
  styleUrl: './lista-defunti.component.css'
})
export class DefuntoEntitiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'codicefiscale', 'nome', 'cognome', 'sesso','action'];
  dataSource: DefuntoEntity[]=[];
  readonly dialog = inject(Dialog);

  constructor(private defuntoEntityService: DefuntoEntityService) {}

  async ngOnInit() {
    await this.loadSampleEntities();
  }

  async loadSampleEntities(): Promise<void> {
    this.dataSource=await lastValueFrom(this.defuntoEntityService.getAllDefunti());
    console.log(this.dataSource);
  }

  openDialog(defunto?: DefuntoEntity): void {
    const dialogRef = this.dialog.open(DialogAddEntity, {data: defunto});

    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
      this.loadSampleEntities().then(r => {
        console.log('Lista defunti reloaded');
      });
    });
  }

  async deleteItem(id: string): Promise<void> {
    await lastValueFrom(this.defuntoEntityService.deleteDefunto(id));
    await this.loadSampleEntities();
  }
}

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
  codicefiscale: string='';
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private defuntoEntityService: DefuntoEntityService, @Inject(DIALOG_DATA) public data: DefuntoEntity | null) {}

  ngOnInit(): void {
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
      this.amministratoreResponsabile = this.data.amministratoreResponsabile || '';
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
