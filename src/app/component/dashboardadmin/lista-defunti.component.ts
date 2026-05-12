import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {DefuntoEntity} from '../../modelli/defunto-entity.model';
import {DefuntoEntityService} from '../../service/defunto-entity.service';
import { lastValueFrom } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';

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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddEntity, {});

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
export class DialogAddEntity{
  readonly dialogRef = inject(DialogRef<DialogAddEntity>);
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
  causaMorte: string = '';
  indirizzoUltimaResidenza: string = '';
  epitaffio: string = '';
  settore: string = '';
  idsepoltura: string = '';
  dataSepoltura: Date | undefined = undefined;
  amministratore: string = '';
  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private defuntoEntityService: DefuntoEntityService) {}

  async save() {
    let entity = new DefuntoEntity();
    entity.nome = this.nome;
    entity.cognome = this.cognome;
    entity.sesso = this.sesso;
    entity.codiceFiscale = this.codiceFiscale;
    entity.dataNascita = this.dataNascita;
    entity.dataMorte = this.dataMorte;
    entity.luogoMorte = this.luogoMorte;
    entity.luogoNascita = this.luogoNascita;
    entity.statoCivile = this.statoCivile;
    entity.causaMorte = this.causaMorte;
    entity.indirizzoUltimaResidenza = this.indirizzoUltimaResidenza;
    entity.epitaffio = this.epitaffio;
    entity.settore = this.settore;
    entity.idsepoltura = this.idsepoltura;
    entity.dataSepoltura = this.dataSepoltura;
    entity.amministratore = this.amministratore;

    await lastValueFrom(this.defuntoEntityService.createDefunto(entity));
    this.dialogRef.close();
  }
}
