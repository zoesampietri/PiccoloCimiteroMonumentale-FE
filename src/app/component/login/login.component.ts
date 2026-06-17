import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Dentro il tuo LoginComponent
  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(isValid => {
      if (isValid) {
        console.log('Login effettuato! CF:', this.authService.getCf());
        this.router.navigate(['/dashboardadmin']); 
      } else {
        console.log('Credenziali errate');
      }
    });
  }
}
