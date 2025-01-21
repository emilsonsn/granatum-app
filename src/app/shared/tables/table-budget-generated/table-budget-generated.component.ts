import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { Budget, BudgetGenerated } from '@models/budget';
import { BudgetService } from '@services/crm/budget.service';
import { BudgetGeneratedService } from '@services/crm/budget_generated.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table-budget-generated',
  templateUrl: './table-budget-generated.component.html',
  styleUrl: './table-budget-generated.component.scss'
})
export class TableBudgetGeneratedComponent {
  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  filters: any;

  @Output()
  onBudgetClick: EventEmitter<BudgetGenerated> =
    new EventEmitter<BudgetGenerated>();

  @Output()
  onBudgetDetailClick: EventEmitter<number> =
    new EventEmitter<number>();

  @Output()
  onDeleteBudgetClick: EventEmitter<number> =
    new EventEmitter<number>();

  public budgets: BudgetGenerated[] = [];

  public columns = [
    {
      slug: "description",
      order: true,
      title: "Titulo",
      align: "start",
    },
    {
      slug: "model",
      order: true,
      title: "Modelo",
      align: "justify-content-center",
    },
    {
      slug: "lead",
      order: true,
      title: "Lead",
      align: "justify-content-center",
    },
    {
      slug: "status",
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
    private readonly _budgetGeneratedService: BudgetGeneratedService
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

    this._budgetGeneratedService
      .search(this.pageControl, this.filters)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: res => {
          this.budgets = res.data;

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
