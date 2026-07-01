// Questo è un modello TypeScript che rappresenta una prenotazione.
export interface PrenotazioneId {
  id_defunto: string;     
  nome_servizio: string; 
}

export class PrenotazioneEntity {
    id!:PrenotazioneId;
    cf_concessionario!: string;
    data?: string;
    ora_inizio?: string;
    stato_organizzativo?: string;
    stato_pagamento?: string;
}