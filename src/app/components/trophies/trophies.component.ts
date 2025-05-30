import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../material.module';
import { TrophyCount } from '../../schemas/domain';
import { GeneralService } from '../../services/general.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-trophies',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.scss'],
})
export class TrophiesComponent {
  loading = false;
  connectionError = false;
  dataSource!: MatTableDataSource<TrophyCount>;
  displayedColumns = ['place', 'count'];

  constructor(
    private generalService: GeneralService,
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
    this.generalService.trophiesCounts().subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<TrophyCount>(data);
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
    this.generalService.trophiesCounts().subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource.data = data;
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
