import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs";
import {LeadService} from "@services/crm/lead.service";
import {Lead} from "@models/Lead";

@Component({
  selector: 'app-table-leads',
  templateUrl: './table-leads.component.html',
  styleUrl: './table-leads.component.scss'
})
export class TableLeadsComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onClientClick: EventEmitter<Lead> =
    new EventEmitter<Lead>();

  @Output()
  onDeleteClientClick: EventEmitter<number> =
    new EventEmitter<number>();

  public leads: Lead[] = [];

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
      title: "Email",
      align: "justify-content-center",
    },
    {
      slug: "phone",
      order: true,
      title: "Telefone",
      align: "justify-content-center",
    },
    {
      slug: "origin",
      order: true,
      title: "Origem",
      align: "justify-content-center",
    },
    {
      slug: "responsible_id",
      order: true,
      title: "Responsável",
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
    private readonly _leadService: LeadService
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

    this._leadService
      .getLeads(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.leads = res.data;

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
