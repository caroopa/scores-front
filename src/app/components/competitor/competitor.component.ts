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
import { CompetitorScore } from '../../schemas/domain';

@Component({
  selector: 'app-competitor',
  standalone: true,
  imports: [MaterialModule],
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
  loading = false;
  connectionError = false;
  dataSource!: MatTableDataSource<CompetitorScore>;
  displayedColumns = ['name', 'belt', 'total'];
  expanded!: CompetitorScore | null;

  constructor(
    private competitorService: CompetitorService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.uploadData();

    this.sharedService.reload$.subscribe(() => {
      this.reloadData();
    });

    this.sharedService.upload$.subscribe(() => {
      this.uploadData();
    });    
  }

  waiting() {
    this.loading = true;
    this.connectionError = false;
  }

  uploadData() {
    this.waiting();
    this.competitorService.getScores(this.category).subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<CompetitorScore>(data);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 0) {
          this.connectionError = true;
        }
      },
    });
  }

  reloadData() {
    this.waiting();
    this.competitorService.getScores(this.category).subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<CompetitorScore>(data);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 0) {
          this.connectionError = true;
        }
      },
    });
  }
}
