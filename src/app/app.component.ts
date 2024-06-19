import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Competitor } from './domain/competitor';
import { FormsModule } from '@angular/forms';
import { CompetitorService } from './services/competitor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  firstPlace = 9;
  secondPlace = 5;
  thirdPlace = 2;
  nonePlace = 0;

  items: Competitor[] = [];
  showError = '';

  constructor(private competitorService: CompetitorService) {}

  ngOnInit() {
    this.competitorService.getAll().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        this.showError = 'No se pudieron cargar los datos.';
        console.log(error);
      },
    });
  }

  calculateTotal(item: Competitor) {
    item.total = item.forms + item.jump + item.combat;
  }
}
