import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

//questo file serve per proteggere certi routing: se scrivo direttamente sul motore di ricerca localhost:4200/dashboardadmin
//non voglio che ci possa andare. Voglio passare prma per il login. Quindi quando definisco il routing gli dico prima di andare al componente 
//controlla che l'utente sia loggato. se si ok nessun problema se no passa dal login.

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
