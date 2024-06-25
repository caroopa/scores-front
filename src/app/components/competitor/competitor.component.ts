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

@Component({
  selector: 'app-competitor',
  standalone: true,
  imports: [MatTableModule, MatSort, MatSortModule],
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
  @ViewChild(MatSort) sort!: MatSort;

  showError = '';
  dataSource!: MatTableDataSource<CompetitorScore>;
  displayedColumns = ['name', 'belt', 'total'];
  expanded!: CompetitorScore | null;

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
