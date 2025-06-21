import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Theatre } from '../../interfaces/Theatre';
import { TheaterService } from '../../services/Theater/theater.service';
import { ToastService } from '../../services/Toast/toast.service';
declare var bootstrap: any;
@Component({
  selector: 'app-manage-theaters',
  templateUrl: './manage-theaters.component.html',
  styleUrls: ['./manage-theaters.component.css']
})
export class ManageTheatersComponent {
  theaters: Theatre[] = [];
  locations: any = [];
  filteredTheaters: Theatre[] = [];
  editingTheater: boolean = false;
  showMovieTheatreModal: boolean = false;
  status: string = '';
  modalData: any = [];
  theater: Theatre = {
    theaterId: 0,
    name: '',
    location: '',
    status: 1,
    address: '',
    seats: [],
    showtimes: [],
  }
  constructor(private router: Router, private _theaterService: TheaterService, private toastService: ToastService) { }
  ngOnInit() {
    this.getAllTheaters();
  }



  getAllTheaters() {
    this._theaterService.getAllTheaters().subscribe(
      res => {
        if (res != null) {
          this.theaters = res;
          this.filteredTheaters = this.theaters;
          //console.log(this.theaters);
          const allLocations = res.map(theater => theater.location);
          this.locations = Array.from(new Set(allLocations));
        }
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error) },
      () => { console.log("Get All Theaters Run Successfully"); }
    )
  }

  saveTheater() {
    if (this.editingTheater) {
      const theater: Theatre = {
        theaterId: this.modalData.theaterId,
        name: this.modalData.name,
        location: this.modalData.location,
        status: this.modalData.status,
        address: this.modalData.address,
        seats: this.modalData.seats,
        showtimes: this.modalData.showtimes
      }
      this._theaterService.updateTheater(theater).subscribe(
        res => {
          this.toastService.showSuccess(res);;
        },
        error => { this.toastService.showError("Something went wrong!!"); console.log(error); this.ngOnInit() },
        () => { console.log("Edit Theater executed successfully"); this.ngOnInit() }
      )
    }
    else {
      const theater: Theatre = {
        theaterId: this.modalData.theaterId,
        name: this.modalData.name,
        location: this.modalData.location,
        status: this.modalData.status,
        address: this.modalData.address,
        seats: this.modalData.seats,
        showtimes: this.modalData.showtimes
      }
      this._theaterService.addTheatre(theater).subscribe(
        res => {
          status = res;
          this.toastService.showSuccess(res);
        },
        err => {
          this.toastService.showError("Something went wrong!!");
          console.log(err);
          this.ngOnInit();
        },
        () => { this.ngOnInit(); }
      )
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('showMovieTheatreModal')!);
    modal?.hide();
  }
  onChange(location: string) {
    console.log("Selected  location:", location);
    if (location == "0") {
      this.filteredTheaters = this.theaters;
    }
    else {
      this.filteredTheaters = this.theaters.filter((theater: any) =>
        theater.location.toString() === location);
    }

  }


  openAddModal() {
    this.modalData = {
      theaterId: 0,
      name: '',
      location: '',
      status: 1,
      address: '',
      seats: [],
      showtimes: []
    };
    this.editingTheater = false;
    new bootstrap.Modal(document.getElementById('showMovieTheatreModal')!).show();
  }

  openEditModal(theater: any) {
    this.modalData = { ...theater };
    this.editingTheater = true;
    new bootstrap.Modal(document.getElementById('showMovieTheatreModal')!).show();
  }
  CloseModalFormReset(form: NgForm) {
    form.resetForm();
  }

  deleteTheater() {
    debugger;
    this._theaterService.deleteTheater(this.modalData.theaterId).subscribe(
      res => {
        this.toastService.showSuccess(res);
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error); this.ngOnInit() },
      () => { console.log("Deleted Theater executed successfully"); this.ngOnInit() }
    )
    const modal = bootstrap.Modal.getInstance(document.getElementById('showMovieTheatreModal')!);
    modal?.hide();
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
