import { Time } from "@angular/common";
import { Funnel } from "./Funnel";

export interface Automations {
  id: number;
  title: string;
  message: string;
  type: AutomationsType;
  recurrence_type: AutomationsRecurrenceType;
  funnel_id: number;
  funnel_step_id?: number;
  channels: AutomationsChannels;
  start_date: Date;
  start_time: Time;
    is_active: boolean;
  funnel?: Funnel;
}

export enum AutomationsType {
  Single = 'Single',
  Recurrence = 'Recurrence'
}

export enum AutomationsRecurrenceType {
  Monthly = 'Monthly',
  Fortnightly = 'Fortnightly',
  Weekly = 'Weekly'
}

export enum AutomationsChannels {
  Email = 'Email',
  Whatsapp = 'WhatsApp'
}
