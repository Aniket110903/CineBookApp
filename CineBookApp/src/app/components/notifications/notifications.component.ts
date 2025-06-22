import { Component, HostListener } from '@angular/core';
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
  isMobile = false;

  constructor(private notificationService: NotificationService, private router: Router) { }

  ngOnInit() {
    this.checkScreenSize();

    this.notificationService.notifications$.subscribe(data => {
      const unread = data.filter((n: any) => n.isRead === 0)
        .sort((a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime());

      // Limit notifications based on screen size
      const maxNotifications = this.isMobile ? 2 : 4;
      const limitedUnread = unread.slice(0, maxNotifications);

      if (limitedUnread.length && this.notificationService.getShown()) {
        this.notifications = limitedUnread;
        this.showNotifications = true;
        this.notificationService.setShown();
        // Optional: hide all after 5 seconds
        setTimeout(() => this.showNotifications = false, 5000);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  dismissNotification(id: number) {
    this.notifications = this.notifications.filter((n: any) => n.notificationId !== id);
    if (this.notifications.length === 0) {
      this.showNotifications = false;
    }
  }

  goToNotification() {
    this.router.navigate(['notifications']);
  }
}
