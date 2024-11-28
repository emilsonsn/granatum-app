import {Component, ElementRef, Renderer2} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {filter, Subscription} from "rxjs";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {SessionService} from '@store/session.service';
import {SessionQuery} from '@store/session.query';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {
  titleProcess: string = '';

  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/painel/home',
      active: true
    },
    {
      label: "Pedidos",
      icon: 'fa-solid fa-box',
      route: null,
      isOpen: false,
      children: [
        {
          label: 'Pedidos',
          icon: 'fa-solid fa-box',
          route: '/painel/orders'
        },
        {
          label: 'Solicitações',
          icon: 'fa-solid fa-bookmark',
          route: '/painel/requests'
        },
        {
          label: 'Fornecedores',
          icon: 'fa-solid fa-truck',
          route: '/painel/provider'
        },
        {
          label: 'Obras',
          icon: 'fa-solid fa-person-digging',
          route: '/painel/construction'
        },
        {
          label: 'Clientes/Contratantes',
          icon: 'fa-solid fa-user-tie',
          route: '/painel/client'
        },
        {
          label: 'Serviços',
          icon: 'fa-solid fa-tools',
          route: '/painel/services'
        },
        {
          label: 'Tarefas',
          icon: 'fa-solid fa-tasks',
          route: '/painel/tasks'
        },
      ]
    },
    {
      label: "Viagens",
      icon: 'fa-solid fa-plane',
      route: null,
      isOpen: false,
      children: [
        {
          label: 'Dashboard',
          icon: 'fa-solid fa-chart-line',
          route: '/painel/travels/dashboard'
        },
        {
          label: 'Viagens',
          icon: 'fa-solid fa-plane',
          route: '/painel/travels'
        }
      ]
    },
    {
      label: "RH",
      icon: 'fa-solid fa-people-group',
      route: null,
      isOpen: false,
      children: [
        {
          label: 'Profissões',
          icon: 'fa-solid fa-hammer',
          route: '/painel/rh/professions'
        },
        {
          label: 'Vagas',
          icon: 'fa-solid fa-passport',
          route: '/painel/rh/vacancies'
        },
        {
          label: 'Processo Seletivo',
          icon: 'fa-solid fa-clipboard',
          route: '/painel/rh/selection-process'
        },
        {
          label: 'Candidatos',
          icon: 'fa-solid fa-person',
          route: '/painel/rh/candidates'
        },
        {
          label: 'Chat',
          icon: 'fa-brands fa-whatsapp',
          route: '/painel/rh/chat'
        },
      ]
    },
    {
      label: 'CRM',
      icon: 'fa-solid fa-people-arrows',
      route: null,
      isOpen: false,
      children: [
        {
          label: 'Dashboard',
          icon: 'fa-solid fa-chart-line',
          route: '/painel/crm/dashboard'
        },
        {
          label: 'Leads',
          icon: 'fa-solid fa-people-group',
          route: '/painel/crm/leads'
        },
        {
          label: 'Automações',
          icon: 'fa-solid fa-robot',
          route: '/painel/crm/automations'
        },
        {
          label: 'Orçamento',
          icon: 'fa-solid fa-receipt',
          route: '/painel/crm/budget'
        },
        {
          label: 'Bancos',
          icon: 'fa-solid fa-building-columns',
          route: '/painel/crm/banks'
        },
        {
          label: 'Parceiros',
          icon: 'fa-solid fa-people-robbery',
          route: '/painel/crm/partners'
        },
        {
          label: 'WebChat',
          icon: 'fa-brands fa-whatsapp',
          route: '/painel/crm/web-chat'
        },
      ]
    },
    {
      label: 'Colaboradores',
      icon: 'fa-solid fa-users',
      route: '/painel/collaborator'
    },
  ]

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery: SessionQuery
  ) {
  }


  ngOnInit(): void {

    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe(user => {
      if (user) {
        this.user = user;

        if (user?.company_position.position == 'Requester'){

          this.menuItem.forEach((item, indice) => {
            if(item.label == 'Pedidos'){
              this.menuItem[indice].children = this.menuItem[indice].children?.filter(menu =>{
                return menu.label == 'Pedidos' ||
                menu.label == 'Solicitações' ||
                menu.label == 'Fornecedores'
              });
            }

            if(item.label == 'Viagens'){
              this.menuItem[indice].children = this.menuItem[indice].children?.filter(menu =>{
                return menu.label == 'Viagens'
              });
            }
          });

          this.permitedMenuItem = this.menuItem.filter(item =>
            item.label == 'Pedidos' ||
            item.label == 'Viagens'
          );
        }
        else{
          this.permitedMenuItem = this.menuItem;
        }
      }
    });


    // Escuta as mudanças nos queryParams diretamente
    this._activatedRoute.queryParams.subscribe(params => {
      this.titleProcess = params['title_process'];
    });
  }


  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

}
