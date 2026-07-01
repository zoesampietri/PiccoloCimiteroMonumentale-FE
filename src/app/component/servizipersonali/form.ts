import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { PrenotazioneEntity } from '../../modelli/prenotazione.model';
import { PrenotazioneEntityService } from '../../service/prenotazione.service';
import { AuthService } from '../../service/auth.service'; 

@Component(
  {
    selector: 'app-form',
    templateUrl: './form.html',
    styleUrl: './form.css',
    standalone: true,
    imports: [CommonModule, FormsModule]
  }
)
export class FormComponent implements OnInit {
  readonly dialogRef = inject(DialogRef<FormComponent>);
  id_defunto: string = '';
  nome_servizio: string = '';
  cf_concessionario: string = '';
  data?: string;
  ora_inizio?: string;
  isRinnovoMode: boolean = false; // Variabile per determinare se il form è in modalità rinnovo

  dataOrigine?: Date=new Date(); // Variabile per memorizzare la data originale della prenotazione

  onNoClick(): void {   // Metodo chiamato quando l'utente clicca su "Annulla" nella finestra di dialogo, chiude la finestra senza salvare i dati
    this.dialogRef.close();
  }

  constructor(private prenotazioneEntityService: PrenotazioneEntityService,  @Inject(DIALOG_DATA) public dataDialog: {prenotazione: PrenotazioneEntity, isRinnovo: boolean}, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.isRinnovoMode = this.dataDialog.isRinnovo;
    this.nome_servizio = this.dataDialog.prenotazione?.id.nome_servizio || '';
    this.id_defunto = this.dataDialog.prenotazione?.id.id_defunto || '';
    this.cf_concessionario = this.dataDialog.prenotazione?.cf_concessionario || '';
    this.ora_inizio = this.dataDialog.prenotazione?.ora_inizio || '';

    if (this.isRinnovoMode) {
      this.data = undefined; // Obbliga a scegliere una nuova data futura
      this.dataOrigine = undefined;
    } else {
      // 2. Estrai solo la stringa YYYY-MM-DD dalla prenotazione esistente
      if (this.dataDialog.prenotazione?.data) {
        const d = new Date(this.dataDialog.prenotazione.data);
        this.data = d.toISOString().split('T')[0];
      } else {
        this.data = new Date().toISOString().split('T')[0];
      }
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

    //Controllo date, posso salvare la prenotazione solo se la data è maggiore o uguale alla data odierna
    if (this.data) {
      const oggiString = new Date().toISOString().split('T')[0];
      

      // Confronto pulito tra i due giorni puri
      if (this.data < oggiString) {
        alert('La data della prenotazione non può essere nel passato.');
        return;
      }
    }

    const entity: PrenotazioneEntity = {
      id: { id_defunto: this.id_defunto, nome_servizio: this.nome_servizio },
      cf_concessionario: this.authService.getCf(),
      data: this.data, // Mantiene il tipo Date previsto dal modello
      ora_inizio: this.ora_inizio
    };
    

    await lastValueFrom(this.prenotazioneEntityService.updatePrenotazione(entity.id, entity));
    
    this.dialogRef.close();
  }

}
