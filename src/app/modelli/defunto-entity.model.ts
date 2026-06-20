// Questo è un modello TypeScript che rappresenta un defunto.
export class DefuntoEntity {
  id?: string;              // Il '?' è un modo rapido per dire "string | undefined"
  codiceFiscale!: string;  // Obbligatorio, lo inserirai dal form
  nome!: string;            // Obbligatorio, lo inserirai dal form
  cognome!: string;         // Obbligatorio
  sesso!: string;          // Obbligatorio, lo inserirai dal form
  dataNascita?: Date;      // Facoltativo, potrebbe essere inserito in un secondo momento
  dataMorte?: Date;       // Facoltativo, potrebbe essere inserito in un secondo momento
  luogoNascita?: string;  // Facoltativo
  luogoMorte?: string;    // Facoltativo
  statoCivile?: string; // Facoltativo
  causaDecesso?: string;  // Facoltativo
  indirizzoUltimaResidenza?: string; // Facoltativo
  epitaffio?: string; // Facoltativo
  settoreSepoltura?: string; // Facoltativo
  idSepoltura?: string; // Facoltativo
  dataSepoltura?: Date; // Facoltativo
  amministratoreResponsabile?: string; // Facoltativo

}