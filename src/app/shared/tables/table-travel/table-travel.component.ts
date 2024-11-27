import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {SessionQuery} from "@store/session.query";
import {ITravel} from "@models/Travel";
import {Column} from "@models/Column";
import {TravelService} from "@services/travel/travel.service";

@Component({
  selector: 'app-table-travel',
  templateUrl: './table-travel.component.html',
  styleUrl: './table-travel.component.scss'
})
export class TableTravelComponent {
  private subscription: Subscription;

  @Input()
  filters;

  @Input()
  deshboard: boolean = false;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onViewOrder = new EventEmitter<ITravel>();

  @Output()
  public onOpenOrder = new EventEmitter<ITravel>();

  @Output()
  public onDeleteOrder = new EventEmitter<ITravel>();

  @Output()
  public onOrderModal = new EventEmitter<ITravel>();

  public columns: Column[] = [
    {
      slug: "id",
      order: false,
      title: "ID",
      classes: "text-center justify-content-center",
    },
    {
      slug: "type",
      order: false,
      title: "Tipo",
      classes: "text-center justify-content-center",
    },
    {
      slug: "description",
      order: false,
      title: "Descrição",
      classes: "text-center justify-content-center",
    },
    {
      slug: "user",
      order: false,
      title: "Colaborador",
      classes: "",
    },
    {
      slug: "transport",
      order: false,
      title: "Transporte",
      classes: "text-center justify-content-center",
    },
    {
      slug: "status",
      order: false,
      title: "Status",
      classes: "text-center justify-content-center",
    },
    {
      slug: "total_value",
      order: false,
      title: "Valor",
      classes: "text-center justify-content-center",
    },
  ];

  public travels: ITravel[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  isFinancial: boolean = false;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _travelService: TravelService,
    private readonly _sessionQuery: SessionQuery
  ) {
  }

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    this.loadPermissions();
  }

  public loadPermissions() {
    this._sessionQuery.user$.subscribe(user => {
      if (user && (user?.company_position.position === 'Financial' || user?.company_position.position === 'Admin')) {
        this.isFinancial = true;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {filters, searchTerm, loading} = changes;

    if (searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
      this._onSearch();
    }

    if (!this.deshboard) {
      this.columns.push({
        slug: "actions",
        order: false,
        title: "Ações",
        classes: "text-center justify-content-center",
      });
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

  search(): void {
    this._initOrStopLoading();

    this._travelService
      .search(this.pageControl, this.filters)
      .pipe(finalize(() => {
        this._initOrStopLoading()
      }))
      .subscribe((res) => {
        this.travels = res.data;

        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
      });
  }

  onClickOrderBy(slug: string, order: boolean) {
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

  pageEvent($event) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

}
