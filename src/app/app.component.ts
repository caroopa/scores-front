import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Competitor } from './domain/competitor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  items: Competitor[] = [
    {
      id: 15,
      school: 'EK',
      instructor: 'CASTRO NEREA DELFINA',
      name: 'BOURSE JAZMIN',
      age: 7,
      belt: 'AMARILLO',
      category: 'COLOR',
    },
    {
      id: 16,
      school: 'ESC',
      instructor: 'WERNER FERNANDO',
      name: 'FLORIANI GABRIEL',
      age: 25,
      belt: 'SEGUNDO DAN',
      category: 'DAN',
    },
    {
      id: 17,
      school: 'CS',
      instructor: 'ACEVEDO JULIETA',
      name: 'ZAMBELLI NATALIA',
      age: 8,
      belt: 'BLANCO PUNTA AMARILLA',
      category: 'COLOR',
    },
    {
      id: 18,
      school: 'ESC',
      instructor: 'ACOSTA BROSSARD MATEO',
      name: 'BECERRA GASTON',
      age: 12,
      belt: 'VERDE PUNTA AZUL',
      category: 'COLOR',
    },
    {
      id: 19,
      school: 'EDG',
      instructor: 'ACUÑA FABIAN',
      name: 'GARCIA DAMIAN',
      age: 11,
      belt: 'ROJO PUNTA NEGRA',
      category: 'COLOR',
    },
    {
      id: 20,
      school: 'EK',
      instructor: 'ACUÑA SANTIAGO ALEJANDRO',
      name: 'PAEZ GUIDO LEONEL',
      age: 11,
      belt: 'VERDE',
      category: 'COLOR',
    },
    {
      id: 21,
      school: 'CS',
      instructor: 'AGUILAR GALEANO ROMEO',
      name: 'IRALA JULIAN NAHUEL',
      age: 8,
      belt: 'AMARILLO',
      category: 'COLOR',
    },
  ];
}
