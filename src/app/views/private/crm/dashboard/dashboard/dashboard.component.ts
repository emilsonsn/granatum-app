import {Component, computed, OnInit, signal, Signal} from '@angular/core';
import {ISmallInformationCard} from "@models/cardInformation";
import {Chart, registerables} from "chart.js";
import {DashboardCrmService} from "@services/crm/dashboard-crm.service";
import {BudgetStats} from "@models/budgetStats";

import {formatCurrency} from "@angular/common";
import {Period} from "@shared/enums/Period";
import {Status} from "@shared/enums/Status";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  periods = Period; // Enum de períodos
  statuses = Status; // Enum de status
  selectedPeriod: keyof typeof Period = 'Annually';
  selectedStatus: keyof typeof Status = 'Approved';

  dashboardCards = signal<BudgetStats>({
    budgetApproved: 0,
    budgetDelivered: 0,
    budgetDesapproved: 0,
    budgetGenerated: 0,
    leads: 0
  });

  barChart: any;
  filters: any = { is_home: true };

  constructor(private readonly _dashboardCrmService: DashboardCrmService) {}

  itemsShopping: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-check-circle', // Aprovado
      icon_description: 'fa-regular fa-calendar',
      background: '#28A745', // Verde para aprovação
      title: formatCurrency(+this.dashboardCards().budgetApproved.toString(), 'pt-BR', 'R$'),
      category: 'Orçamento',
      description: 'Orçamento aprovado',
    },
    {
      icon: 'fa-solid fa-truck', // Entregas
      icon_description: 'fa-regular fa-calendar',
      background: '#FFC107', // Amarelo para entregas
      title: formatCurrency(+this.dashboardCards().budgetDelivered.toString(), 'pt-BR', 'R$'),
      category: 'Orçamento',
      description: 'Orçamento entregue',
    },
    {
      icon: 'fa-solid fa-times-circle', // Reprovado
      icon_description: 'fa-regular fa-calendar',
      background: '#DC3545', // Vermelho para reprovações
      title: formatCurrency(+this.dashboardCards().budgetDesapproved.toString(), 'pt-BR', 'R$'),
      category: 'Orçamento',
      description: 'Orçamento reprovado',
    },
    {
      icon: 'fa-solid fa-file-invoice-dollar', // Gerado
      icon_description: 'fa-regular fa-calendar',
      background: '#17A2B8', // Azul para geração
      title: formatCurrency(+this.dashboardCards().budgetGenerated.toString(), 'pt-BR', 'R$'),
      category: 'Orçamento',
      description: 'Orçamento gerado',
    },
    {
      icon: 'fa-solid fa-user-plus', // Leads
      icon_description: 'fa-regular fa-calendar',
      background: '#6F42C1', // Roxo para leads
      title: +this.dashboardCards().leads.toString(),
      category: 'Leads',
      description: 'Leads adicionados',
    },
  ]);


  ngOnInit() {
    Chart.register(...registerables);
    this.initChart();
    this.applyFilters();
  }

  initChart(): void {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Pedidos',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    });
  }

  applyFilters(): void {
    this.loadCards(this.selectedPeriod);
    this.loadBudgetGraphic(this.selectedStatus);
  }

  loadCards(period: keyof typeof Period): void {
    this._dashboardCrmService.getCards(period).subscribe(
      (response) => {
        this.dashboardCards.set(response.data);
      },
      (error) => {
        console.error('Erro ao carregar os cards:', error);
      }
    );
  }

  loadBudgetGraphic(status: keyof typeof Status): void {
    this._dashboardCrmService.getBudgetGraphic(status).subscribe(
      (response) => {
        const data = response.data;

        // Mapeando as chaves de data (YYYY-MM) para siglas de meses
        const labels = Object.keys(data).map(date => {
          const monthIndex = parseInt(date.split('-')[1], 10) - 1; // Pega o índice do mês
          const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          return months[monthIndex]; // Retorna a sigla do mês
        });

        this.barChart.data.datasets[0].data = Object.values(data); // Dados do gráfico
        this.barChart.data.labels = labels; // Novos labels com siglas dos meses
        this.barChart.update(); // Atualiza o gráfico
      },
      (error) => {
        console.error('Erro ao carregar o gráfico de orçamento:', error);
      }
    );
  }

}
