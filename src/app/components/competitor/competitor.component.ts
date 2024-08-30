import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
import { Base } from '../../schemas/base';

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
export class CompetitorComponent extends Base<CompetitorScore> {
  @Input() category!: string;
  displayedColumns = ['name', 'belt', 'total'];

  constructor(
    private competitorService: CompetitorService,
    sharedService: SharedService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(sharedService, changeDetectorRef);
  }

  getService() {
    return this.competitorService.getScores(this.category);
  }

  handleSuccess(data: CompetitorScore[]): void {
    this.dataSource = new MatTableDataSource<CompetitorScore>(data);
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
