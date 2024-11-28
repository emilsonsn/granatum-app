import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { SessionQuery } from '@store/session.query';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { VacancyService } from '@services/vacancy.service';
import { Vacancy } from '@models/vacancy';
import { SelectionProcess } from '@models/selectionProccess';
import { SelectionProcessService } from '@services/selection-process.service';

@Component({
  selector: 'app-table-selection-processes',
  templateUrl: './table-selection-processes.component.html',
  styleUrl: './table-selection-processes.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableSelectionProcessComponent {
  private subscription: Subscription;

  @Input()
  showActions: boolean = true;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onEdit = new EventEmitter<SelectionProcess>();

  @Output()
  public OnInfo = new EventEmitter<SelectionProcess>();

  @Output()
  public onDelete = new EventEmitter<SelectionProcess>();

  public columns = [
    {
      slug: 'title',
      order: true,
      title: 'Título',
      classes: '',
    },
    {
      slug: 'vacancy',
      order: true,
      title: 'Vaga',
      classes: '',
    },
    {
      slug: 'profession',
      order: true,
      title: 'Profissão',
      classes: '',
    },
    {
      slug: 'total_candidates',
      order: true,
      title: 'Nª máximo de candidatos',
      classes: '',
    },
    {
      slug: 'available_vacancies',
      order: true,
      title: 'Vagas disponíveis',
      classes: '',
    },
    {
      slug: 'actions',
      order: false,
      title: 'Ações',
      classes: 'justify-content-center',
    },
  ];

  public selectionProcess: SelectionProcess[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'id',
    order: Order.ASC,
  };

  protected expanded: any;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _selectionProcessService: SelectionProcessService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    if (!this.showActions) {
      this.columns.pop();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if (
      searchTerm?.previousValue &&
      searchTerm?.currentValue !== searchTerm?.previousValue
    ) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm;
    this.pageControl.page = 1;
    this.search();
  }

  goToCandidatingPage(id) {
    window.open(`/public/vaga?selection_process=${id}`, '_blank');
  }

  public search(): void {
    this._initOrStopLoading();

    this._selectionProcessService
      .getList(this.pageControl, this.filters)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe((res) => {
        this.selectionProcess = res.data;

        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
      });
  }

  public onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order =
        this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  public pageEvent($event) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

  // Utils
  public toggleExpanded(element) {
    if (this.expanded === element) {
      this.expanded = null;
    } else {
      this.expanded = element;
    }
  }
}
