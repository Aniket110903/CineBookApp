import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { Theatre } from '../../interfaces/Theatre';
import { ToastService } from '../../services/Toast/toast.service';
import { ViewShowTimingService } from '../../services/ViewShowtiming/view-show-timing.service';
import { MovieService } from '../../services/Movie/movie.service';
import { TheaterService } from '../../services/Theater/theater.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
  movies: Movie[] = [];
  AllShowTimming: any = {};
  FilterShowTimming: any = {};
  theaters: Theatre[] = [];
  moviesLst: Movie[] = [];
  filterTheater: Theatre[] = [];
  constructor(private toastService: ToastService, private _movieService: MovieService, private router: Router, private _viewShowTimmingService: ViewShowTimingService, private _theatersService: TheaterService) { }
  ngOnInit() {
    this.getAllMovies();
    this.getAllShowTime();
  }
  getAllMovies() {
    this._movieService.getAllMovies().subscribe(
      res => {
        this.movies = res;
      },
      err => {
        console.log(err);
      },
      () => console.log("Movies Fetched Successfully"))
  }

  modifyMovies() {
    this.router.navigate(['/admin/modifyMovies'])
  }

  getAllShowTime() {
    this._viewShowTimmingService.getShowTimming().subscribe(
      res => {
        if (res != null) {
          this.AllShowTimming = res;
          //console.log(this.AllShowTimming);
          this.FilterShowTimming = this.AllShowTimming.slice(0, 6);
          this.getAllTheaters();
          this.getAllMoviesLst();
        }
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error) },
      () => { console.log("Get ALl Showtimming Run Successfully"); }
    )
  }

  getAllTheaters() {
    this._theatersService.getAllTheaters().subscribe(
      res => {
        if (res != null) {
          this.theaters = res;
          this.filterTheater = this.theaters.slice(0, 6);
          //console.log(this.theaters);
          this.AllShowTimming.forEach((showtime: any) => {
            const theater = this.theaters.find(t => t.theaterId === showtime.theaterId);
            showtime.theaterName = theater ? theater.name : 'Unknown Theater';
            showtime.location = theater ? theater.location : 'Unknown';
          });
          console.log("after theraters:", this.AllShowTimming);
          this.FilterShowTimming = this.AllShowTimming.slice(0, 6);
        }
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error); },
      () => { console.log("Get ALl Theaters Run Successfully"); }
    )
  }


  getAllMoviesLst() {
    this._movieService.getAllMovies().subscribe(
      res => {
        if (res != null) {
          this.movies = res;
          this.AllShowTimming.forEach((showtime: any) => {
            const Movie = this.movies.find(t => t.movieId === showtime.movieId);
            showtime.MovieName = Movie ? Movie.title : 'Unknown Movie';
          });
          console.log("after Movies:", this.AllShowTimming);
          this.FilterShowTimming = this.AllShowTimming.slice(0, 6);
        }
      },
      err => {
        console.log(err);
      },
      () => console.log("Movies Fetched Successfully"))
  }
  modifyshowtime() {
    this.router.navigate(['/admin/manageShowTime'])
  }
  modifyTheater() {
    this.router.navigate(['/admin/manageTheater'])
  }
}
