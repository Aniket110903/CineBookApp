import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateProfile } from '../../interfaces/UpdateProfile';
import { ToastService } from '../../services/Toast/toast.service';
import { UserService } from '../../services/User/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {
  @ViewChild('updateForm') updateForm!: NgForm;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  address: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isUpdating: boolean = false;
  showModal: boolean = false;
  user: any;
  showResetCode = false;
  editPopUp: boolean = false;
  modalInstance: any;

  constructor(private toastService: ToastService, private userService:UserService, private router: Router) { }

  ngOnInit() {
    // Load user from sessionStorage once on component init
    const userData = sessionStorage.getItem("user");
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap modal
    const modalElement = document.getElementById('updateProfileModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  openModal(): void {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  // Edit button handler: populate form from local user, no backend fetch
  onEdit() {
    if (!this.user) return;

    // Populate form fields from local user object
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.address = '';
    this.confirmPassword = '';

    this.editPopUp = true;

    // Reset form and clear validations, set form values
    if (this.updateForm) {
      this.updateForm.resetForm({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        address: this.address,
        confirmPassword: ''
      });
    }

    this.openModal();
  }

  openPasswordModal(form: any) {
    if (form.valid) {
      this.editPopUp = false;
      this.showModal = true;
    }
  }

  closePasswordModal() {
    this.showModal = false;
    this.confirmPassword = '';
    this.closeModal();
  }

  confirmUpdate() {
    this.showModal = false;
    this.editPopUp = false;
    this.closeModal();

    const userProfile: UpdateProfile = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.user.email,
      newEmail: this.email,
      address: this.address,
      password: this.confirmPassword
    };

    this.userService.updateProfile(userProfile).subscribe(
      res => {
        this.toastService.showSuccess(res);
        // Update local user object and sessionStorage after successful update
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.user.email = this.email;
        this.user.address = this.address;
        sessionStorage.setItem("user", JSON.stringify(this.user));
      },
      error => {
        console.error(error);
        this.toastService.showError("Something went wrong!!");
      },
      () => {
        console.log("Profile update completed successfully.");
      }
    );
  }

  toggleResetCode(): void {
    this.showResetCode = !this.showResetCode;
  }

  closeEditPopup() {
    this.isUpdating = false;
    this.showModal = false;
    this.editPopUp = false;
    this.closeModal();

    if (this.updateForm) {
      this.updateForm.resetForm();
    }

    // Clear all bound variables
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.address = '';
    this.confirmPassword = '';
  }
  goBack(): void {
    if (this.user.role == 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
