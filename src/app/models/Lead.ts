import {User} from "@models/user";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  origin?: string;
  observations?: string;
  responsible_id: number;
  responsible: User;
}
