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
  selection_process?: SelectionProcess;
}

export enum HrCampaignType {
  Single = 'Avulso',
  Recurring = 'Recorrente'
}

export enum HrCampaignRecurrenceType {
  Monthly = 'Mensal',
  Fortnightly = 'Quinzenal',
  Weekly = 'Semanal'
}

export enum HrCampaignChannels {
  Email = 'Email',
  Whatsapp = 'WhatsApp'
}
