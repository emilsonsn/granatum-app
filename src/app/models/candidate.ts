import { Profession } from './profession';
import { SelectionProcess } from './selectionProccess';

export interface Candidate {
  id?: number;
  name: string;
  surname: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  marital_status: string;
  is_active: boolean;
  profession: Profession;
  profession_id: number;
  attachments: string[] | File[];
  processes: [
    {id: number}
  ];
  processesObj: SelectionProcess[]; // EMILSON - CANDIDATOS
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CandidateCards {
  totalCandidates : number;
  totalCandidatesActive : number;
  totalCandidatesInactive : number;
}

export enum MaritalStatus {
  Single = "Solteiro(a)",
  Married = "Casado(a)",
  Divorced = "Divorciado(a)",
  Widowed = "Viúvo(a)",
  Separated = "Separado(a)"
}
