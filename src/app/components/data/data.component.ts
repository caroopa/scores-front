import { Component, ViewChild } from '@angular/core';
import { Competitor } from '../../domain/competitor';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CompetitorService } from '../../services/competitor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed, expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DataComponent {
  firstPlace = 9;
  secondPlace = 5;
  thirdPlace = 2;
  nonePlace = 0;
  radioOptions = [1, 2, 3, 0];

  competitors!: Competitor[];
  showError = '';
  expanded!: Competitor | null;
  dataSource!: MatTableDataSource<Competitor>;

  displayedColumns: string[] = [
    // 'id_competitor',
    'school',
    'instructor',
    'name',
    // 'age',
    // 'belt',
    'isDan',
    'forms',
    'combat',
    'jump',
    'total',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private competitorService: CompetitorService) {}

  ngOnInit() {
    // TODO: MANEJO DE ERRORES

    this.competitorService.getAll().subscribe({
      next: (data) => {
        // console.log(data);

        this.competitors = data;
        this.dataSource = new MatTableDataSource<Competitor>(data);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.paginator._intl.itemsPerPageLabel = 'Competidores por página';
        this.paginator._intl.nextPageLabel = 'Siguiente';
        this.paginator._intl.previousPageLabel = 'Anterior';
        this.paginator._intl.firstPageLabel = 'Inicio';
        this.paginator._intl.lastPageLabel = 'Fin';
      },
      error: (error) => {
        this.showError = 'No se pudieron cargar los datos.';
        console.log(error);
      },
    });
  }

  getData() {
    this.competitorService.getAll().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.getData();
  }

  calculateTotal(competitor: Competitor) {
    // TODO: HACER ALGO MIENTRAS ESPERA LA RESPUESTA
    this.competitorService.calculateTotal(competitor).subscribe({
      next: () => {
        this.getData();
      },
    });
  }
}
