import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/Toast/toast.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  constructor(private router: Router, private toastService: ToastService) { }

  ngOnInit() {

  }
  goToChangePassword() {
    this.router.navigate(['/forgotpass']);
  }
  NavigateToMovie() {
    this.router.navigate(['/admin/modifyMovies']);
  }
  NavigateToTheater() {
    this.router.navigate(['/admin/manageTheater']);
  }
  NavigateToManageShowTime() {
    this.router.navigate(['/admin/manageShowTime'])
  }
  NavigateToManageFeedbacks() {
    this.router.navigate(['/admin/manageFeedbacks'])
  }
  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['']);
    this.toastService.showSuccess("Successfully logged out.");
  }
  EditProfle() {
    this.router.navigate(['/admin/editProfile']);
  }
}
