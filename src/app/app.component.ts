import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { DataComponent } from './components/data/data.component';
import { InstructorsComponent } from './components/instructors/instructors.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataComponent, MatTabsModule, InstructorsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
