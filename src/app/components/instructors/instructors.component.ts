import { Component, ViewChild } from '@angular/core';
import { InstructorScore } from '../../domain/domain';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { InstructorService } from '../../services/instructor.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [MatTableModule, MatSort, MatSortModule],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss',
})
export class InstructorsComponent {
  showError = '';
  dataSource!: MatTableDataSource<InstructorScore>;
  displayedColumns = ['name', 'total'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private instructorService: InstructorService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.reloadData();
    this.sharedService.reload$.subscribe(() => {
      this.reloadData();
    });
  }

  reloadData() {
    // TODO: MANEJO DE ERRORES

    this.instructorService.getScores().subscribe({
      next: (data) => {
        // console.log(data);

        this.dataSource = new MatTableDataSource<InstructorScore>(data);
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.showError = 'No se pudieron cargar los datos.';
        console.log(error);
      },
    });
  }
}
