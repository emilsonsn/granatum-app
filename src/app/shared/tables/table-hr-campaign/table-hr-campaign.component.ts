import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { HrCampaign } from '@models/hrCampaign';
import { HrCampaignService } from '@services/hr-campaign.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-hr-campaign',
  templateUrl: './table-hr-campaign.component.html',
  styleUrl: './table-hr-campaign.component.scss'
})
export class TableHrCampaignComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onHrCampaignClick: EventEmitter<HrCampaign> =
    new EventEmitter<HrCampaign>();

  @Output()
  onDeleteHrCampaignClick: EventEmitter<number> =
    new EventEmitter<number>();

  public hrCampaigns: HrCampaign[] = [];

  public columns = [
    {
      slug: "title",
      order: true,
      title: "Titulo",
      align: "start",
    },
    {
      slug: "selection_process",
      order: true,
      title: "Processo seletivo",
      align: "justify-content-center",
    },
    // {
    //   slug: "type",
    //   order: true,
    //   title: "Tipo",
    //   align: "justify-content-center",
    // },
    {
      slug: "channels",
      order: true,
      title: "Canal",
      align: "justify-content-center",
    },
    {
      slug: "start_date",
      order: true,
      title: "Data de inicio",
      align: "justify-content-center",
    },
    {
      slug: "start_time",
      order: true,
      title: "Data de inicio",
      align: "justify-content-center",
    },
    {
      slug: "is_active",
      order: true,
      title: "Status",
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
    private readonly _hrCampaignService: HrCampaignService
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

    this._hrCampaignService
      .getHrCampaigns(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.hrCampaigns = res.data;

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
