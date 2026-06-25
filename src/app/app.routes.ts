import { Routes } from '@angular/router';
import {DefuntoEntitiesComponent} from './component/dashboardadmin/lista-defunti.component';
import { LoginComponent } from './component/login/login.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './component/home/home.component';
import { MappaComponent } from './component/mappa/mappa.component';

// Sto dicendo che tutte le volte che un utente diggita l'url localhost:4200/<qualcosa> allora il router carica il componente 
// corrispondente a quell'url.

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboardadmin', component: DefuntoEntitiesComponent, canActivate: [authGuard] },
  { path: 'mappa', component: MappaComponent }
];

