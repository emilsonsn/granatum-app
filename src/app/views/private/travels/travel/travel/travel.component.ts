import {Component, computed, Signal} from '@angular/core';
import {ITravel} from "@models/Travel";
import {ISmallInformationCard} from "@models/cardInformation";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss'
})
export class TravelComponent {
  loading: boolean;
  filters: any;

  itemsTravel: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-envelope-open',
      // icon_description: 'fa-solid fa-calendar-day',
      // background: '#17a2b8',
      title: "this.cards().solicitationPending",
      category: 'Solicitações em aberto',
      description: 'Solicitações em aberto',
    },
    {
      icon: 'fa-solid fa-calendar-times',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#dc3545',
      title: "this.cards().solicitationReject",
      category: 'Solicitações vencidas',
      description: 'Solicitações vencidas',
    },
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: "this.cards().solicitationFinished",
      category: 'Solicitações resolvidas',
      description: 'Solicitações resolvidas',
    },
  ]);


  openRequestDialog($event?: ITravel) {

  }

  deleteDialog($event: ITravel) {

  }

  onOrderModal($event: ITravel) {

  }

  openOrderFilterDialog() {

  }

}
