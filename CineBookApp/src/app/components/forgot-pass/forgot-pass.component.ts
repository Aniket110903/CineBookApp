import { Component } from '@angular/core';
//import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { ForgotPassService } from '../../services/ForgotPassword/forgot-pass.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css'],
  //animations: [
  //  trigger('fadeIn', [
  //    transition(':enter', [
  //      style({ opacity: 0 }),
  //      animate('300ms ease-in', style({ opacity: 1 }))
  //    ])
  //  ])
  //]
})
export class ForgotPassComponent {
  verificationEmail: string = '';
  resetCode: string = '';

  resetEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showVerification: boolean = true;
  showResetPassword: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private forgotPassService: ForgotPassService, private router: Router) { }

  verifyCode() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.verificationEmail || !this.resetCode) {
      this.errorMessage = 'Please enter both email and reset code.';
      return;
    }
    this.forgotPassService.verifyResetCode(this.verificationEmail.trim(), this.resetCode.trim()).subscribe(

      res => {
        // res is an object with success, message, userId
        if (res.success) {
          console.log('API Response:', res);
          this.successMessage = res.message || 'Verification successful! Please enter your new password.';
          this.showVerification = false;
          this.showResetPassword = true;
          this.resetEmail = this.verificationEmail;
        } else {
          console.log('API Response:', res);
          this.errorMessage = res.message || 'Verification failed. Please check your email and reset code.';
        }
      },
      err => {
        this.errorMessage = 'Error verifying code. Please try again.';
      }
    );

  }

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.resetEmail || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all the fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.forgotPassService.resetPassword(this.resetEmail, this.newPassword, this.confirmPassword).subscribe(
      res => {
        if (res.success === true) {
          this.successMessage = 'Password reset successful! You can now log in with your new password.';
          this.showResetPassword = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Password reset failed. Please try again.';
        }
      },
      err => {
        this.errorMessage = 'Error resetting password. Please try again.';
      }
    );
  }
}
