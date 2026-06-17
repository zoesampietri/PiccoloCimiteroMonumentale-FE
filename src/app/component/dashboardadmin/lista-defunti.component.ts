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
