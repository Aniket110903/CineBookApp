import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Notification } from '../../interfaces/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationServService {

  constructor(private http: HttpClient) { }
  getNotification(userId: number) {
    return this.http.get<any>("http://cinebook.runasp.net/api/Notification/GetNotifications?userId=" + userId).pipe(catchError(this.errorHandler));
  }
  markAsRead(notificationId: number) {
    return this.http.put<any>("http://cinebook.runasp.net/api/Notification/MarkAsRead?notificationId=" + notificationId, null).pipe(catchError(this.errorHandler));
  }
  markAllAsRead(userId: number) {
    return this.http.put<any>("http://cinebook.runasp.net/api/Notification/MarkAllAsRead?userId=" + userId, null).pipe(catchError(this.errorHandler));
  }
  addnotifications(data: Notification) {
    return this.http.post<string>("http://cinebook.runasp.net/api/Notification/AddNotification", data).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }
}
