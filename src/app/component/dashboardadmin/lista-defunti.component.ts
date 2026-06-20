import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {DefuntoEntity} from '../../modelli/defunto-entity.model';
import {DefuntoEntityService} from '../../service/defunto-entity.service';
import { lastValueFrom } from 'rxjs';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogAddEntity } from './dialog-add-entity';

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
  displayedColumns: string[] = ['id', 'codicefiscale', 'nome', 'cognome', 'sesso','action'];// Definisce le colonne da visualizzare nella tabella dei defunti
  dataSource: DefuntoEntity[]=[];   // Array che conterrà i dati dei defunti da visualizzare nella tabella
  readonly dialog = inject(Dialog);   // Inietta il servizio Dialog per aprire finestre di dialogo

  constructor(private defuntoEntityService: DefuntoEntityService) {}

  async ngOnInit() {    // Metodo chiamato quando il componente viene inizializzato, carica la lista dei defunti
    await this.loadSampleEntities();
  }

  async loadSampleEntities(): Promise<void> {   // Metodo che carica la lista dei defunti dal servizio DefuntoEntityServic, chiamata dal metodo ngOnInit
    this.dataSource=await lastValueFrom(this.defuntoEntityService.getAllDefunti());
    console.log(this.dataSource);
  }

  openDialog(defunto?: DefuntoEntity): void {   // Metodo che apre una finestra di dialogo per aggiungere o modificare un defunto, riceve come parametro un oggetto DefuntoEntity opzionale
    const dialogRef = this.dialog.open(DialogAddEntity, {data: defunto});   // Apre la finestra di dialogo passando come dati l'oggetto defunto se presente, altrimenti passa null

    dialogRef.closed.subscribe(result => {  // Si iscrive all'evento closed della finestra di dialogo, che viene emesso quando la finestra viene chiusa. Quando la finestra viene chiusa, ricarica la lista dei defunti
      console.log('The dialog was closed');
      this.loadSampleEntities().then(r => {
        console.log('Lista defunti reloaded');
      });
    });
  }

  async deleteItem(id: string): Promise<void> {   // Metodo che elimina un defunto dalla lista, riceve come parametro l'id del defunto da eliminare
    await lastValueFrom(this.defuntoEntityService.deleteDefunto(id));
    await this.loadSampleEntities();
  }
}
