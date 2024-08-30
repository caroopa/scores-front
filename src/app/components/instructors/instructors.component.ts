import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { InstructorScore } from '../../schemas/domain';
import { InstructorService } from '../../services/instructor.service';
import { SharedService } from '../../services/shared.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Base } from '../../schemas/base';
import { LoadingComponent } from "../loading/loading.component";

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
  imports: [MaterialModule, LoadingComponent],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: SpanishPaginatorIntl,
    },
  ],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss',
})
export class InstructorsComponent extends Base<InstructorScore> {
  displayedColumns = ['name', 'total'];

  constructor(
    private instructorService: InstructorService,
    sharedService: SharedService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(sharedService, changeDetectorRef);
  }

  getService() {
    return this.instructorService.getScores();
  }

  reloadData() {
    this.waiting();
    this.instructorService.getScores().subscribe({
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
