import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CompetitorService } from '../../services/competitor.service';
import { SharedService } from '../../services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { CompetitorScore } from '../../domain/domain';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-competitor',
  standalone: true,
  imports: [MaterialModule, MatSort],
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

  // @ViewChild('competitorPag', { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  constructor(
    private competitorService: CompetitorService,
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
    this.competitorService.getScores(this.category).subscribe({
      next: (data) => {
        // console.log(data);
        this.dataSource = new MatTableDataSource<CompetitorScore>(data);
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
