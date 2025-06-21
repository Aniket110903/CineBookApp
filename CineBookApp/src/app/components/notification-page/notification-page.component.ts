import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/Notification/notification.service';
import { ToastService } from '../../services/Toast/toast.service';
import { NotificationServService } from '../../services/NotificationServ/notification-serv.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.css']
})
export class NotificationPageComponent {
  notifications: any[] = [];
  user: any;
  isAllRead: boolean = true;
  unreadNotificationsCount: number = 0;
  constructor(private notificationService: NotificationServService, private toastService: ToastService, private router: Router, private notification: NotificationService) { }

  ngOnInit() {
    // Fetch notifications when component loads
    const temp = sessionStorage.getItem("user");
    if (temp != null) {
      const user = JSON.parse(temp);
      this.user = user;
      this.getAllNotifications();
      this.notification.unreadCount$.subscribe(count => {
        this.unreadNotificationsCount = count;
      });
    } else {
      this.router.navigate(['']);
    }

  }
  markAsRead(notification: any) {
    this.notificationService.markAsRead(notification.notificationId).subscribe(
      res => {
        this.toastService.showSuccess(res);
        this.getAllNotifications();
        this.notification.updateUnreadCount(this.unreadNotificationsCount - 1);
      },
      error => { this.toastService.showError(error); console.log(error) },
      () => { console.log("Successfully run mark as read"); }
    )
  }
  markAllAsRead() {
    this.notificationService.markAllAsRead(this.user.userId).subscribe(
      res => {
        this.toastService.showSuccess(res);
        this.getAllNotifications();
        this.notification.updateUnreadCount(0);
      },
      error => { this.toastService.showError(error); console.log(error) },
      () => { console.log("successfully run Mark all as read") }
    )
  }
  getAllNotifications() {

    this.notificationService.getNotification(this.user.userId).subscribe(data => {
      const now = new Date();

      this.notifications = data
        .filter((n: any) => new Date(n.displayTime) <= now && n.isRead == 0)
        .sort((a: any, b: any) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime());

      this.isAllRead = true;
      this.notifications.forEach(x => {
        if (x.isRead == 0) {
          this.isAllRead = false;
        }
      });
    },
      error => {
        console.log(error);
        this.toastService.showError(error);
      },
      () => {
        console.log("Successfully run getAllNotifications");
      });

  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

}
