import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Booking } from '../../interfaces/Booking';
import { AddBooking } from '../../interfaces/AddBooking';
import { ConfirmBooking } from '../../interfaces/ConfirmBooking';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  [x: string]: any;
  private baseUrl = 'http://cinebook.runasp.net/api/Users/BookingHistory'; // Your actual endpoint

  constructor(private http: HttpClient) { }

  getBookingHistory(userId: number): Observable<Booking[]> {
    // Assuming your API expects userId as a query param
    return this.http.get<{ success: boolean; data: Booking[] }>(`${this.baseUrl}?userId=${userId}`)
      .pipe(
        map(response => response.data)
      );
  }

  AddBooking(addBooking: AddBooking) {
    return this.http.post<any>("http://cinebook.runasp.net/api/Booking/CreateBooking", addBooking).pipe(catchError(this.errorHandler));
  }
  ConfirmBooking(bookingId: number, seats: number[], razorpayId: string, razopayOrderId: string, razorpaySignature: string, Status: string, useLoyalty: boolean, userId: number) {
    const confirmBooking: ConfirmBooking = {
      bookingId: bookingId,
      SeatIds: seats,
      RazorpayOrderId: razopayOrderId,
      RazorpayPaymentId: razorpayId,
      RazorpaySignature: razorpaySignature,
      PaymentStatus: Status,
      UseLoyaltyPoints: useLoyalty,
      UserId: userId
    }
    return this.http.post<any>("http://cinebook.runasp.net/api/Booking/ConfirmBooking", confirmBooking).pipe(catchError(this.errorHandler));
  }
  cancelBooking(bookingId: number): Observable<string> {
    return this.http.delete<string>(`http://cinebook.runasp.net/api/Booking/CancelBooking?bookingId=${bookingId}`).pipe(catchError(this.errorHandler));

  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>("http://cinebook.runasp.net/api/Booking/GetAllBookings").pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }

}
