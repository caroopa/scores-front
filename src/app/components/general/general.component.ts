import {
  Component,
  ElementRef,
  Injectable,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { GeneralService } from '../../services/general.service';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { General, Score } from '../../schemas/domain';
import { Subject } from 'rxjs';

@Injectable()
export class SpanishPaginatorIntl extends MatPaginatorIntl {
  override changes = new Subject<void>();
  override itemsPerPageLabel = 'Competidores por página:';
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
  selector: 'app-general',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: SpanishPaginatorIntl,
    },
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
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
export class GeneralComponent {
  firstPlace = 9;
  secondPlace = 5;
  thirdPlace = 2;
  nonePlace = 0;
  radioOptions = [1, 2, 3, 0];
  calculatingTotal = false;
  idCalculating!: number | null;

  loading = false;
  connectionError = false;
  expanded!: General | null;
  dataSource!: MatTableDataSource<General>;

  displayedColumns = [
    'school',
    'instructor',
    'name',
    'is_dan',
    'forms',
    'combat',
    'jump',
    'total',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: true }) searchInput!: ElementRef;

  constructor(
    private generalService: GeneralService,
    private sharedService: SharedService,
    private renderer: Renderer2
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
    this.generalService.getAll().subscribe({
      next: (data) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<General>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // 🎯 Filtro que ignora acentos y mayúsculas
        this.dataSource.filterPredicate = (data: General, filter: string) => {
          const normalize = (str: string) =>
            str
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');

          const filterText = normalize(filter);

          const searchable = normalize(
            `${data.name} ${data.instructor} ${data.school}`
          );

          return searchable.includes(filterText);
        };
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
    this.generalService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.calculatingTotal = false;
        this.idCalculating = null;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 0) {
          this.connectionError = true;
        }
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // 🔥 No recargues los datos
    // this.reloadData(); ❌
  }

  calculateTotal(event: Event, element: General) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.calculatingTotal) {
      const competitor_id = element.id_competitor;
      const score: Score = {
        forms: element.forms,
        combat: element.combat,
        jump: element.jump,
      };

      this.calculatingTotal = true;
      this.idCalculating = competitor_id;

      this.generalService.calculateTotal(competitor_id, score).subscribe({
        error: (error) => {
          console.error('Error calculating:', error);
        },
      });
    }
  }

  onInputBlur(event: FocusEvent) {
    const target = event.relatedTarget as HTMLElement;
    if (target && target.tagName === 'INPUT') {
      target.focus();
    }
  }

  ngAfterViewInit() {
    if (this.searchInput) {
      this.renderer.listen(
        this.searchInput.nativeElement,
        'blur',
        this.onInputBlur.bind(this)
      );
    }
  }
}
