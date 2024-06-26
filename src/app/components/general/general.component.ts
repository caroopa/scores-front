import { Component, ViewChild } from '@angular/core';
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
import { GeneralService } from '../../services/general.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { General, Score } from '../../domain/domain';

@Component({
  selector: 'app-general',
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
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
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
export class GeneralComponent {
  firstPlace = 9;
  secondPlace = 5;
  thirdPlace = 2;
  nonePlace = 0;
  radioOptions = [1, 2, 3, 0];

  showError = '';
  expanded!: General | null;
  dataSource!: MatTableDataSource<General>;

  displayedColumns = [
    'school',
    'instructor',
    'name',
    'is_dan',
    'forms',
    'combat',
    'jump',
    'total',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private generalService: GeneralService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    // TODO: MANEJO DE ERRORES
    this.uploadData();

    this.sharedService.reload$.subscribe(() => {
      this.reloadData();
    });

    this.sharedService.upload$.subscribe(() => {
      this.uploadData();
    });
  }

  uploadData() {
    this.generalService.getAll().subscribe({
      next: (data) => {
        // console.log(data);

        this.dataSource = new MatTableDataSource<General>(data);
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

  reloadData() {
    this.generalService.getAll().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.reloadData();
  }

  calculateTotal(event: Event, element: General) {
    // prevents service's double call
    event.stopPropagation();
    event.preventDefault();

    const competitor_id = element.id_competitor;
    const score: Score = {
      forms: element.forms,
      combat: element.combat,
      jump: element.jump,
    };

    // TODO: HACER ALGO MIENTRAS ESPERA LA RESPUESTA
    this.generalService.calculateTotal(competitor_id, score).subscribe({
      next: () => {
        this.sharedService.reload();
      },
    });
  }
}
