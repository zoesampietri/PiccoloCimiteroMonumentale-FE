import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

//questo file serve per proteggere certi routing: se scrivo direttamente sul motore di ricerca localhost:4200/dashboardadmin
//non voglio che ci possa andare. Voglio passare prima per il login. Quindi quando definisco il routing gli dico prima di andare al componente 
//controlla che l'utente sia loggato. se si ok nessun problema se no passa dal login.

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const urlDestinazione = state.url;
  if (urlDestinazione.includes('/dashboardadmin') && authService.isLoggedIn() === 'amministratore') {
    return true;
  } else if (urlDestinazione.includes('/servizipersonali') && authService.isLoggedIn() === 'concessionario') {
    return true;
  }
  else {
    router.navigate(['/login'], { queryParams: { returnUrl: urlDestinazione } });
    return false;
  }
};
