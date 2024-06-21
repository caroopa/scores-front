import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { DataComponent } from './components/data/data.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataComponent, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
