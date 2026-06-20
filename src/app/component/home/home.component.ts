import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
