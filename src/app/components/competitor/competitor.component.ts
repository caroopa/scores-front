import { Component, Input, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CompetitorService } from '../../services/competitor.service';
import { SharedService } from '../../services/shared.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompetitorScore } from '../../domain/domain';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-competitor',
  standalone: true,
  imports: [MatTableModule, MatSort, MatSortModule, MatPaginatorModule],
  templateUrl: './competitor.component.html',
  styleUrl: './competitor.component.scss',
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
export class CompetitorComponent {
  @Input() category!: string;

  showError = '';
  dataSource!: MatTableDataSource<CompetitorScore>;
  displayedColumns = ['name', 'belt', 'total'];
  expanded!: CompetitorScore | null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private competitorService: CompetitorService,
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
    this.competitorService.getScores(this.category).subscribe({
      next: (data) => {
        // console.log(data);

        this.dataSource = new MatTableDataSource<CompetitorScore>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // this.paginator._intl.itemsPerPageLabel = 'Competidores por página';
        // this.paginator._intl.nextPageLabel = 'Siguiente';
        // this.paginator._intl.previousPageLabel = 'Anterior';
        // this.paginator._intl.firstPageLabel = 'Inicio';
        // this.paginator._intl.lastPageLabel = 'Fin';
      },
      error: (error) => {
        this.showError = 'No se pudieron cargar los datos.';
        console.log(error);
      },
    });
  }

  reloadData() {
    this.competitorService.getScores(this.category).subscribe((data) => {
      this.dataSource = new MatTableDataSource<CompetitorScore>(data);
    });
  }
}
