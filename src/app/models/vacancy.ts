import { Profession } from "./profession";

export interface Vacancy {
  id?: number;
  title: string;
  description: string;
  profession_id : number;
  profession? : Profession;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface VacancyCards {
  totalVacancysMonth: number;
  activeVacancys: number;
  inactiveVacancys: number;
}
