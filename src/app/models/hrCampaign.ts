import { Time } from "@angular/common";
import { SelectionProcess } from "./selectionProccess";

export interface HrCampaign {
  id: number;
  title: string;
  message: string;
  type: HrCampaignType;
  recurrence_type: HrCampaignRecurrenceType;
  selection_process_id: number;
  status_id?: number;
  channels: HrCampaignChannels;
  start_date: Date;
  start_time: Time;
  is_active: boolean;
  selection_process?: SelectionProcess;
}

export enum HrCampaignType {
  Single = 'Single',
  Recurrence = 'Recurrence'
}

export enum HrCampaignRecurrenceType {
  Monthly = 'Monthly',
  Fortnightly = 'Fortnightly',
  Weekly = 'Weekly'
}

export enum HrCampaignChannels {
  Email = 'Email',
  Whatsapp = 'WhatsApp'
}
