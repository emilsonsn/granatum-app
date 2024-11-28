import {Candidate} from "@models/candidate";
import { Profession } from "./profession";

export {SelectionProcess, Vacancy, Statuses, CandidateStatus}

interface SelectionProcess {
  id: number;
  title: string;
  total_candidates: number;
  available_vacancies: number;
  user_id: number;
  vacancy_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  vacancy: Vacancy;
  statuses: Statuses[];
}

interface Vacancy {
  id: number;
  title: string;
  description: string;
  profession_id: number;
  profession: Profession;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Statuses {
  id: number;
  title: string;
  color: string;
  selection_process_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  candidate_statuses: CandidateStatus[];
}

interface CandidateStatus {
  id: number;
  candidate_id: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  candidate: Candidate;
}

export interface SelectionProcessCards {
  totalSelectionProcesssMonth: number;
  activeSelectionProcesss: number;
  inactiveSelectionProcesss: number;
}
