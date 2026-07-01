import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { PrenotazioneEntity } from '../../modelli/prenotazione.model';
import { PrenotazioneEntityService } from '../../service/prenotazione.service';
import { ServizioEntity } from '../../modelli/servizio.model';
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

  onNoClick(): void {   // Metodo chiamato quando l'utente clicca su "Annulla" nella finestra di dialogo, chiude la finestra senza salvare i dati
    this.dialogRef.close();
  }

  constructor(private prenotazioneEntityService: PrenotazioneEntityService,  @Inject(DIALOG_DATA) public servizio: ServizioEntity, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.nome_servizio = this.servizio?.nome || '';
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
      const dataSelezionata = new Date(this.data);
      dataSelezionata.setHours(0, 0, 0, 0); // Azzera ore/minuti del form

      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0); // Azzera ore/minuti di adesso

      // Confronto pulito tra i due giorni puri
      if (dataSelezionata < oggi) {
        alert('La data della prenotazione non può essere nel passato.');
        return;
      }
    }

    const entity: PrenotazioneEntity = {
      id: { id_defunto: this.id_defunto, nome_servizio: this.nome_servizio },
      cf_concessionario: this.authService.getCf(),
      data: this.data,
      ora_inizio: this.ora_inizio
    };
    

    await lastValueFrom(this.prenotazioneEntityService.createPrenotazione(entity));
    
    this.dialogRef.close();
  }
}
