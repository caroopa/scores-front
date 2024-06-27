import { Component, Injectable, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { InstructorScore } from '../../domain/domain';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { InstructorService } from '../../services/instructor.service';
import { SharedService } from '../../services/shared.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class SpanishPaginatorIntl extends MatPaginatorIntl {
  override changes = new Subject<void>();

  override itemsPerPageLabel = 'Instructores:';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `${page + 1} - ${amountPages} de ${length}`;
  };
}
@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [MaterialModule],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: SpanishPaginatorIntl,
    },
  ],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss',
})
export class InstructorsComponent {
  showError = '';
  dataSource!: MatTableDataSource<InstructorScore>;
  displayedColumns = ['name', 'total'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private instructorService: InstructorService,
    private sharedService: SharedService
  ) {}

  ngAfterViewInit() {
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
    this.instructorService.getScores().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<InstructorScore>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.showError = 'No se pudieron cargar los datos.';
        console.log(error);
      },
    });
  }

  reloadData() {
    this.instructorService.getScores().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
}
