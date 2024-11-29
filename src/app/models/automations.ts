import { Funnel } from "./Funnel";

export interface Automations {
  id: number;
  title: string;
  message: string;
  type: AutomationsType;
  recurrence_type: string;
  funnel_id: number;
  funnel_step_id?: number;
  channels: string;
  start_date: string;
  funnel?: Funnel;
}

export enum AutomationsType {
  SINGLE = 'Isolado',
  RECURRING = 'Recorrente'
}

export enum AutomationsRecurrenceType {
  MONTHLY = 'Mensal',
  FORTNIGHTLY = 'Quinzenal',
  WEEKLY = 'Semanal'
}
