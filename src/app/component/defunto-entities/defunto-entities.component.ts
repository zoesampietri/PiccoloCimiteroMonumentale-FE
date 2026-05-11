import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {DefuntoEntity} from '../../modelli/defunto-entity.model';
import {DefuntoEntityService} from '../../service/defunto-entity.service';
import {lastValueFrom} from 'rxjs';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-defunto-entities',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatButton
  ],
  templateUrl: './defunto-entities.component.html',
  styleUrl: './defunto-entities.component.css'
})
export class DefuntoEntitiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'codicefiscale', 'nome', 'cognome', 'sesso','action'];
  dataSource: DefuntoEntity[]=[];
  readonly dialog = inject(MatDialog);


  constructor(private defuntoEntityService: DefuntoEntityService) {}

  async ngOnInit() {
    await this.loadSampleEntities();
  }

  async loadSampleEntities(): Promise<void> {
    this.dataSource=await lastValueFrom(this.defuntoEntityService.getAll());
    console.log(this.dataSource);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddEntity, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadSampleEntities().then(r => {
        console.log('Sample entities reloaded');
      });
    });
  }

  async deleteItem(id: string): Promise<void> {
    await lastValueFrom(this.defuntoEntityService.delete(id));
    await this.loadSampleEntities();
  }
}

@Component(
  {
    selector: 'dialog-add-entity',
    templateUrl: './dialog-add-entity.html',
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions
    ]
  }
)
export class DialogAddEntity{
  readonly dialogRef = inject(MatDialogRef<DialogAddEntity>);
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

    await lastValueFrom(this.defuntoEntityService.create(entity));
    this.dialogRef.close();
  }
}
