import { Component, ViewChild } from '@angular/core';
import { InstructorScore } from '../../domain/domain';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { InstructorService } from '../../services/instructor.service';
import { SharedService } from '../../services/shared.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [MatTableModule, MatSort, MatSortModule, MatPaginatorModule],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss',
})
export class InstructorsComponent {
  showError = '';
  dataSource!: MatTableDataSource<InstructorScore>;
  displayedColumns = ['name', 'total'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private instructorService: InstructorService,
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
    this.instructorService.getScores().subscribe({
      next: (data) => {
        // console.log(data);
        
        this.dataSource = new MatTableDataSource<InstructorScore>(data);
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
    this.instructorService.getScores().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
}
