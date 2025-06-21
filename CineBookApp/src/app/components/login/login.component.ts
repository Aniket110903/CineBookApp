import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/User/user.service';
import { ToastService } from '../../services/Toast/toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoggingIn = false;
  errorMessage = '';
  user: any = '';
  constructor(private _login:UserService, private router: Router, private toastService: ToastService) { }


  submitLoginForm(form: NgForm) {
    this._login.validateCredentials(form.value.email, form.value.password).subscribe(
      res => {
        this.user = res;

        if (this.user && this.user.userId && this.user.userId !== 0) {
          this.toastService.showSuccess("Successfully logged in.");
          sessionStorage.setItem('user', JSON.stringify(res));

          if (res.role === "User") {
            this.router.navigate([""]);
          } else if (res.role === "Admin") {
            this.router.navigate(["/admin"]);
          }
        } else {
          // API responded but credentials were incorrect
          this.toastService.showError("Invalid Email/Password!");
        }
      },
      error => {
        // Server returned an error (e.g., 401 Unauthorized)
        this.toastService.showError("Invalid Email/Password!");
        console.error("Login error:", error);
      },
      () => {
        console.log("SubmitLoginForm method executed successfully");
      }
    );
  }




}







