import { User } from "./User";

export interface Notification {
  userId: number;
  message: string;
  notificationType: string;
  user: any;
  isRead: number;
  displayTime: Date;
}
