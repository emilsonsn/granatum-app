import { Pipe, PipeTransform } from '@angular/core';
import { AutomationsRecurrenceType, AutomationsType } from '@models/automations';
import { HrCampaignRecurrenceType, HrCampaignType } from '@models/hrCampaign';
import { OrderResponsible } from '@models/requestOrder';

@Pipe({
  name: 'recurrence'
})
export class RecurrencePipe implements PipeTransform {

  transform(value: HrCampaignRecurrenceType|AutomationsRecurrenceType) {
    switch (value) {
      case HrCampaignRecurrenceType.Monthly:
        return 'Mensal';
      case HrCampaignRecurrenceType.Fortnightly:
        return 'Quinzenal';
      case HrCampaignRecurrenceType.Weekly:
        return 'Semanal'
      default:
        return value;
    }
  }

}
