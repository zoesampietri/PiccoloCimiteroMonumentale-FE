import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(username: string, email: string): boolean {
    // MODIFICA QUI: Credenziali fisse temporanee
    if (username === 'a' && email === 'a') {
      this.loggedIn = true;
      return true;
    }
    this.loggedIn = false;
    return false;
  }

  logout(): void {
    this.loggedIn = false;
  }
}
