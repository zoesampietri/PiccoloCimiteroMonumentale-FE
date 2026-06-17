import { Routes } from '@angular/router';
import {DefuntoEntitiesComponent} from './component/dashboardadmin/lista-defunti.component';
import { LoginComponent } from './component/login/login.component';
import { authGuard } from './auth.guard';
//import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
  //{ path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboardadmin', component: DefuntoEntitiesComponent, canActivate: [authGuard] }
];

