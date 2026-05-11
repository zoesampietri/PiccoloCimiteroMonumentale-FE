import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {DefuntoEntitiesComponent} from './component/defunto-entities/defunto-entities.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
