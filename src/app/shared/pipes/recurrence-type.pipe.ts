import { Pipe, PipeTransform } from '@angular/core';
import { AutomationsType } from '@models/automations';
import { HrCampaignRecurrenceType, HrCampaignType } from '@models/hrCampaign';
import { OrderResponsible } from '@models/requestOrder';

@Pipe({
  name: 'campaign_type'
})
export class CampaignTypePipe implements PipeTransform {

  transform(value: HrCampaignType|AutomationsType) {
    switch (value) {
      case HrCampaignType.Recurrence:
        return 'Recorrênte';
      case HrCampaignType.Single:
        return 'Avulso';
      default:
        return value;
    }
  }

}
