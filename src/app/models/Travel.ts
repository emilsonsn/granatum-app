import {User} from "@models/user";

export interface ITravel {
  id?: number;
  description: string;
  type: string;
  transport: string;
  total_value: number;
  observations?: string | null;
  purchase_date: string;
  has_granatum: boolean;
  user_id?: number;
  purchase_status?: string;
  user?: User;
  attachments?: ITravelAttachment[];
}

export interface ITravelAttachment {
  id?: number;
  name: string;
  path: string;
  travel_id?: number;
}
