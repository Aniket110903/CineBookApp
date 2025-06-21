import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/User/user.service';
import { User } from '../../interfaces/User';
import { ToastService } from '../../services/Toast/toast.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  user: any = '';
  errorMessage = '';
  isRegistering = false;

  // Modal control variables
  showModal = false;
  resetCode = '';

  constructor(
    private registerService: UserService,
    private router: Router,
    private toastService: ToastService
  ) { }

  submitRegisterForm(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isRegistering = true;

    const user: User = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      address: form.value.address,
      role: 'User',
      ResetCode: "0",
    };

    this.registerService.RegisterUser(user).subscribe(
      (response: string) => {
        this.isRegistering = false;

        if (response && response.includes('Registration successful')) {
          // Extract reset code from response string
          const resetCodeMatch = response.match(/reset code is:\s*(\w+)/i);
          this.resetCode = resetCodeMatch ? resetCodeMatch[1] : '';

          // Show modal popup with reset code
          this.showModal = true;

          // Clear form after registration
          form.resetForm();

          // Store email/password in sessionStorage if needed
          sessionStorage.setItem('email', user.email);
          sessionStorage.setItem('password', user.password);

          this.toastService.showSuccess('Successfully Registered');
          // Wait for user to close modal before navigation
        } else {
          this.errorMessage = 'Registration failed. Please try again later.';
        }
      },
      error => {
        this.isRegistering = false;
        console.error('Error during registration', error);
        this.errorMessage = 'An error occurred during registration';
      }
    );
  }

  // Close modal and navigate to login
  closeModal() {
    this.showModal = false;
    this.router.navigate(['/login']);
  }
}
