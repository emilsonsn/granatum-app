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
import { Candidate } from '@models/candidate';
import { CandidateService } from '@services/candidate.service';

@Component({
  selector: 'app-table-candidates',
  templateUrl: './table-candidates.component.html',
  styleUrl: './table-candidates.component.scss',
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
export class TableCandidatesComponent {
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
  public onEdit = new EventEmitter<Candidate>();

  @Output()
  public onDelete = new EventEmitter<Candidate>();

  public columns = [
    {
      slug: 'name',
      order: true,
      title: 'Nome',
      classes: '',
    },
    {
      slug: 'email',
      order: true,
      title: 'Email',
      classes: '',
    },
    {
      slug: 'phone',
      order: true,
      title: 'Phone',
      classes: '',
    },
    {
      slug: 'profession',
      order: true,
      title: 'Profissão',
      classes: '',
    },
    {
      slug: 'is_active',
      order: true,
      title: 'Status',
      classes: '',
    },
    {
      slug: 'actions',
      order: false,
      title: 'Ações',
      classes: 'justify-content-end me-3 pe-3',
    },
  ];

  public candidates: Candidate[] = [];

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
    private readonly _candidateService: CandidateService,
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

  public search(): void {
    this._initOrStopLoading();

    this._candidateService
      .getList(this.pageControl, this.filters)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe((res) => {
        this.candidates = res.data;

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
