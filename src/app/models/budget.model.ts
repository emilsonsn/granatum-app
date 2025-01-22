export interface Budget{
    budget_id?: number;
    title: string;
    description: string;
    lead_id: number;
    status: 'pending'| 'approved'|'rejected';
}