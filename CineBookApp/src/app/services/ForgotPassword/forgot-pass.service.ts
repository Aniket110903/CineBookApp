import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerifyResponse } from '../../interfaces/VerifyResponse';
import { ResetPasswordRequest } from '../../interfaces/ResetPasswordRequest';



@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {
  [x: string]: any;

  constructor(private http: HttpClient) { }
  verifyResetCode(email: string, resetCode: string): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>('http://cinebook.runasp.net/api/Users/VerifyResetCode', {
      email,
      resetCode  // <- matches API definition exactly
    });
  }



  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<ResetPasswordRequest> {
    return this.http.post<ResetPasswordRequest>('http://cinebook.runasp.net/api/Users/ResetPassword', {
      email,
      newPassword,
      confirmPassword
    });
  }

}
