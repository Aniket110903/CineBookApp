import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { Showtime } from '../../interfaces/Showtime';
import { Theatre } from '../../interfaces/Theatre';
import { MovieService } from '../../services/Movie/movie.service';
import { TheaterService } from '../../services/Theater/theater.service';
import { ToastService } from '../../services/Toast/toast.service';
import { ViewShowTimingService } from '../../services/ViewShowtiming/view-show-timing.service';
declare var bootstrap: any;
@Component({
  selector: 'app-manage-showtimes',
  templateUrl: './manage-showtimes.component.html',
  styleUrls: ['./manage-showtimes.component.css']
})

export class ManageShowtimesComponent {
  AllShowTimming: any = {};
  FilterShowTimming: any = {};
  theaters: Theatre[] = [];
  movies: Movie[] = [];
  modalData: any = {};
  editingShowtime: boolean = false;
  todayDate: string = '';
  constructor(private router: Router, private toastService: ToastService, private _viewShowTimmingService: ViewShowTimingService, private _theatersService: TheaterService, private _movieService: MovieService) { }

  ngOnInit() {
    this.getAllShowTime();
    const now = new Date();
    this.todayDate = now.toISOString().slice(0, 16);
  }

  getAllShowTime() {
    this._viewShowTimmingService.getShowTimming().subscribe(
      res => {
        if (res != null) {
          this.AllShowTimming = res;
          //console.log(this.AllShowTimming);
          this.FilterShowTimming = this.AllShowTimming;
          this.getAllTheaters();
          this.getAllMovies();
        }
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error); },
      () => { console.log("Get ALl Showtimming Run Successfully"); }
    )
  }

  getAllTheaters() {
    this._theatersService.getAllTheaters().subscribe(
      res => {
        if (res != null) {
          this.theaters = res;
          //console.log(this.theaters);
          this.AllShowTimming.forEach((showtime: any) => {
            const theater = this.theaters.find(t => t.theaterId === showtime.theaterId);
            showtime.theaterName = theater ? theater.name : 'Unknown Theater';
            showtime.location = theater ? theater.location : 'Unknown';
            showtime.theaterAddress = theater ? theater.address : 'Unknown';
          });
          console.log("after theraters:", this.AllShowTimming);
          this.FilterShowTimming = this.AllShowTimming;
        }
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error) },
      () => { console.log("Get ALl Theaters Run Successfully"); }
    )
  }

  getAllMovies() {
    this._movieService.getAllMovies().subscribe(
      res => {
        if (res != null) {
          this.movies = res;
          this.AllShowTimming.forEach((showtime: any) => {
            const Movie = this.movies.find(t => t.movieId === showtime.movieId);
            showtime.MovieName = Movie ? Movie.title : 'Unknown Movie';
          });
          console.log("after Movies:", this.AllShowTimming);
          this.FilterShowTimming = this.AllShowTimming;
        }
      },
      err => {
        console.log(err);
      },
      () => console.log("Movies Fetched Successfully"))
  }

  onChange(selectedTheaterId: string, selectedMovieId: string) {
    console.log("Selected Theater ID:", selectedTheaterId);
    console.log("Selected Movie ID:", selectedMovieId);
    if (selectedTheaterId == "0" && selectedMovieId == "0") {
      this.FilterShowTimming = this.AllShowTimming;
    }
    else if (selectedTheaterId != "0" && selectedMovieId != "0") {
      this.FilterShowTimming = this.AllShowTimming.filter((showtime: any) =>
        showtime.theaterId.toString() === selectedTheaterId &&
        showtime.movieId.toString() === selectedMovieId
      );
    } else if (selectedMovieId != "0" && selectedTheaterId == "0") {
      this.FilterShowTimming = this.AllShowTimming.filter((showtime: any) =>
        showtime.movieId.toString() === selectedMovieId
      )
    } else {
      this.FilterShowTimming = this.AllShowTimming.filter((showtime: any) =>
        showtime.theaterId.toString() === selectedTheaterId);
    }

  }

  saveShowtime(form: NgForm) {
    if (this.editingShowtime) {
      // Edit existing
      console.log(this.modalData);
      const showtime: Showtime = {
        showtimeId: this.modalData.showtimeId,
        movieId: this.modalData.movieId,
        theaterId: parseInt(this.modalData.theaterId),
        theaterAdd: this.modalData.address,
        theaterLoc: this.modalData.location,
        startTime: this.modalData.startTime,
        endTime: this.modalData.endTime

      }
      this._viewShowTimmingService.editShowTimming(showtime).subscribe(
        res => {
          this.toastService.showSuccess(res);
        },
        error => { this.toastService.showError("Something went wrong!!"); console.log(error); this.ngOnInit() },
        () => { console.log("Edit showtimming executed successfully"); this.ngOnInit() }
      )
    }
    else {
      console.log(this.modalData);
      // Add new
      const showtime: Showtime = {
        showtimeId: 0,
        movieId: this.modalData.movieId,
        theaterAdd: this.modalData.address,
        theaterLoc: this.modalData.location,
        theaterId: parseInt(this.modalData.theaterId),
        startTime: this.modalData.startTime,
        endTime: this.modalData.endTime
      }
      this._viewShowTimmingService.addShowTimming(showtime).subscribe(
        res => {
          this.toastService.showSuccess(res);
        },
        error => { this.toastService.showError("Something went wrong!!");; console.log(error); this.ngOnInit() },
        () => { console.log("add showtimming executed successfully"); this.ngOnInit() }
      )
    }

    // Hide modal manually
    const modal = bootstrap.Modal.getInstance(document.getElementById('showtimeModal')!);
    modal?.hide();
    form.resetForm();

  }

  openAddModal() {
    this.modalData = {
      movieId: '',
      theaterId: '',
      startTime: '',
      endTime: ''
    };
    this.editingShowtime = false;
    new bootstrap.Modal(document.getElementById('showtimeModal')!).show();

  }

  openEditModal(showtime: any) {
    this.modalData = { ...showtime };
    this.editingShowtime = true;
    new bootstrap.Modal(document.getElementById('showtimeModal')!).show();
  }

  closeModal(form: NgForm) {
    form.resetForm();
  }

  deleteAllPrevShowTime() {
    this._viewShowTimmingService.deleteAllPrevShowTime().subscribe(
      res => {
        this.toastService.showSuccess(res);
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error); this.ngOnInit() },
      () => { console.log("Delete all prev showtimming executed successfully"); this.ngOnInit() }
    )
  }

  deleteShowtime(showTimeId: string) {
    this._viewShowTimmingService.deleteShowTime(showTimeId).subscribe(
      res => { this.toastService.showSuccess(res); },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error); this.ngOnInit() },
      () => { console.log("Delete  showtimming executed successfully"); this.ngOnInit() }
    )
    const modal = bootstrap.Modal.getInstance(document.getElementById('showtimeModal')!);
    modal?.hide();
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
