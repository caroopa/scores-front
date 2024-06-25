import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralComponent } from './components/general/general.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { CompetitorComponent } from './components/competitor/competitor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GeneralComponent,
    MatTabsModule,
    InstructorsComponent,
    CompetitorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
