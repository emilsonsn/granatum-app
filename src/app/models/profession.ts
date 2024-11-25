export interface Profession {
  id: number;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ProfessionCards {
  totalProfessionsMonth : number;
  totalProfessions : number;
}
