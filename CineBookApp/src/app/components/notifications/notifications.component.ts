import { Component } from '@angular/core';
import { NotificationService } from '../../services/Notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notifications: any = [];
  showNotifications = false;

  constructor(private notificationService: NotificationService, private router: Router) { }


  ngOnInit() {
    this.notificationService.notifications$.subscribe(data => {
      const unread = data.filter((n: any) => n.isRead === 0)
        .sort((a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime())
        .slice(0, 4);
      if (unread.length && this.notificationService.getShown()) {
        this.notifications = unread;
        this.showNotifications = true;
        this.notificationService.setShown();

        // Optional: hide all after 2 seconds
        setTimeout(() => this.showNotifications = false, 5000);
      }
    });
  }

  dismissNotification(id: number) {
    this.notifications = this.notifications.filter((n: any) => n.notificationId !== id);
    if (this.notifications.length === 0) {
      this.showNotifications = false;
    }
  }
  goToNotification() {
    this.router.navigate(['notifications'])
  }
}
