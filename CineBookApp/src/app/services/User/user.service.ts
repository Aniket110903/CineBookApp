import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ConfirmBooking } from '../../interfaces/ConfirmBooking';
import { UpdateProfile } from '../../interfaces/UpdateProfile';
import { User } from '../../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "https://localhost:44325/api/Users";
  constructor(private http: HttpClient) { }

  validateCredentials(email: string, password: string): Observable<User> {
    const body: User = {
      "firstName": "string",
      "lastName": "string",
      "email": email,
      "password": password,
      "address": "string",
      "role": "string",
      ResetCode: "string",
    }
    return this.http.post<User>("https://localhost:44325/api/Users/LoginUser", body).pipe(catchError(this.errorHandler));
  }
  RegisterUser(user: User): Observable<string> {

    return this.http.post<string>("https://localhost:44325/api/Users/Register", user).pipe(catchError(this.errorHandler));

  }
  verifyResetCode(email: string, resetCode: string): Observable<boolean> {
    const payload = { email, resetCode };
    return this.http.post<boolean>(`${this.baseUrl}/VerifyResetCode`, payload).pipe(
      catchError(this.errorHandler)
    );
  }

  // New method to update password
  updatePassword(email: string, newPassword: string): Observable<boolean> {
    const payload = { email, newPassword };
    return this.http.post<boolean>(`${this.baseUrl}/UpdatePassword`, payload).pipe(
      catchError(this.errorHandler)
    );
  }
  updateProfile(updateprofile: UpdateProfile): Observable<string> {
    return this.http.put<string>("https://localhost:44325/api/Users/UpdateProfile", updateprofile).pipe(catchError(this.errorHandler));
  }
  addLoyalPoint(userId: number, seatIds: number[]): Observable<any> {
    const addloyalPoint: ConfirmBooking = {
      UserId: userId,
      SeatIds: seatIds,
      bookingId: 0,
      PaymentStatus: "null",
      RazorpayOrderId: "null",
      RazorpayPaymentId: "null",
      RazorpaySignature: "null",
      UseLoyaltyPoints: false
    }
    return this.http.put<any>(`${this.baseUrl}/AddLoyalPoint`, addloyalPoint)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }

}
