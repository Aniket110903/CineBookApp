import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../Toast/toast.service';
import { NotificationServService } from '../NotificationServ/notification-serv.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  private shown = false;
  userId: any;
  constructor(private Notification: NotificationServService, private toastService: ToastService) { }
  fetchNotifications(userId: number) {
    //if (this.notificationsSubject.value.length > 0) {
    //  // Already fetched
    //  return;
    //}
    this.Notification.getNotification(userId).subscribe(
      res => {

        const now = new Date();
        const data = res.filter((n: any) =>
          n.isRead === 0 && new Date(n.displayTime) <= now
        );
        this.notificationsSubject.next(data);
        this.unreadCount.next(0);
        this.unreadCount.next(data.length);
      },
      error => { console.log(error), this.toastService.showError("Something Went Wrong!") },
      () => { console.log("Successfully run Notifications.") }
    )
  }
  setShown() {
    this.shown = true;
  }

  getShown() {
    return this.shown;
  }
  resetNotifications() {
    this.notificationsSubject.next([]);
    this.unreadCount.next(0);
    this.shown = false;
  }
  updateUnreadCount(count: number) {
    this.unreadCount.next(count);
  }
}
