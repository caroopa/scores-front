import { Component, Input, ViewChild } from '@angular/core';
import { CompetitorService } from '../../services/competitor.service';
import { SharedService } from '../../services/shared.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompetitorScore } from '../../domain/domain';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-competitor',
  standalone: true,
  imports: [MatTableModule, MatSort, MatSortModule],
  templateUrl: './competitor.component.html',
  styleUrl: './competitor.component.scss'
})
export class CompetitorComponent {
  @Input() category!: string;
  showError = '';
  dataSource!: MatTableDataSource<CompetitorScore>;
  displayedColumns = ['name', 'belt', 'total'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private competitorService: CompetitorService,
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

    this.competitorService.getScores(this.category).subscribe({
      next: (data) => {
        // console.log(data);

        this.dataSource = new MatTableDataSource<CompetitorScore>(data);
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.showError = 'No se pudieron cargar los datos.';
        console.log(error);
      },
    });
  }
}
