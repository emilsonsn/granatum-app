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
  funnel?: Funnel;
}

export enum AutomationsType {
  Single = 'Avulso',
  Recurring = 'Recorrente'
}

export enum AutomationsRecurrenceType {
  Monthly = 'Mensal',
  Fortnightly = 'Quinzenal',
  Weekly = 'Semanal'
}

export enum AutomationsChannels {
  Email = 'Email',
  Whatsapp = 'WhatsApp'
}
