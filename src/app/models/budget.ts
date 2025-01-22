import { Lead } from "./Lead";

export interface Budget {
  id: number;
  title: string;
  description: string;
}

export interface BudgetGenerated{
  id: number;
  description: string;
  status: string;
  budget: Budget;
  lead: Lead;
  budget_id: number;
  lead_id: number;

}