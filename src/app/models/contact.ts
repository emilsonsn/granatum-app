export enum ContactStatus {
  Attending = "attending",
  Waiting = "waiting",
  Completed = "completed"
}

export interface Contact {
  uuid: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  phone: string;
  remoteJid: string;
  status: ContactStatus;
  photo: string;
  tag?: string;
  unread: boolean;
}
