export interface Funnel {
  id?: number,
  name: string,
  description: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface FunnelStep {
  id?: number,
  name: string,
  description: string;
  funnel_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}