export interface SelectionProcess {
  id?: number;
  title: string;
  total_candidates: number;
  available_vacancies: number;
  vacancy_id: number;
  is_active: true;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SelectionProcessCards {
  totalSelectionProcesssMonth: number;
  activeSelectionProcesss: number;
  inactiveSelectionProcesss: number;
}
