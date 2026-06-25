export interface SepolturaId {
  id: string;     
  numero: string; 
}

export class SepolturaEntity {
  id!: SepolturaId;    
  capacita!: number;
  tipologia!: string;
  stato!: string;
  cf_concessionario?: string;
  data_inizio_contratto?: Date;
  durata?: number;  
}
