import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Partner } from '@models/partner';
import { PartnersService } from '@services/crm/partners.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-partner',
  templateUrl: './table-partner.component.html',
  styleUrl: './table-partner.component.scss'
})
export class TablePartnerComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onPartnerClick: EventEmitter<Partner> =
    new EventEmitter<Partner>();

  @Output()
  onDeletePartnerClick: EventEmitter<number> =
    new EventEmitter<number>();

  public partners: Partner[] = [];

  public columns = [
    {
      slug: "name",
      order: true,
      title: "Nome",
      align: "start",
    },
    {
      slug: "email",
      order: true,
      title: "E-mail",
      align: "start",
    },
    {
      slug: "phone",
      order: true,
      title: "Telefone",
      align: "start",
    },
    {
      slug: "is_active",
      order: true,
      title: "Ativo",
      align: "justify-content-center",
    },
    {
      slug: "",
      order: true,
      title: "Ações",
      align: "justify-content-center",
    },
  ];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _partnerService: PartnersService
  ) {
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

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm || '';
    this.pageControl.page = 1;
    this.search();
  }

  search(): void {
    this._initOrStopLoading();

    this._partnerService
      .getBanks(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.partners = res.data;

          this.pageControl.page = res.current_page - 1;
          this.pageControl.itemCount = res.total;
          this.pageControl.pageCount = res.last_page;
        },
        error: err => {
          this._toastr.error(
            err?.error?.message || "Ocorreu um erro ao buscar os dados"
          );
        }
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

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }
}
