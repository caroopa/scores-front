import { ChangeDetectorRef, Injectable, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../services/shared.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class Base<T> {
  loading = false;
  connectionError = false;
  dataSource!: MatTableDataSource<T>;
  expanded: T | null = null;
  abstract displayedColumns: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sharedService: SharedService,
    private changeDetectorRef: ChangeDetectorRef
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

  private setupDataSource() {
    // this.changeDetectorRef.detectChanges();
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  waiting() {
    this.loading = true;
    this.connectionError = false;
  }

  abstract getService(): Observable<T[]>;

  uploadData() {
    this.waiting();
    this.getService().subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<T>(data);
        this.setupDataSource();
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 0) {
          this.connectionError = true;
        }
      },
    });
  }

  abstract reloadData(): void;
}
