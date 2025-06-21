import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { MovieService } from '../../services/Movie/movie.service';
import { ToastService } from '../../services/Toast/toast.service';
declare var bootstrap: any;
@Component({
  selector: 'app-modify-movies',
  templateUrl: './modify-movies.component.html',
  styleUrls: ['./modify-movies.component.css']
})
export class ModifyMoviesComponent {
  movies: Movie[] = [];
  editMoviesFlag: boolean = false;
  editMovies: boolean = false;
  selectedMovie: any = {};
  fileName: any = '';
  addMovieFlag: boolean = false;
  today: string = "";
  editingMovie: boolean = false;
  constructor(private router: Router, private _movieService: MovieService, private toastService: ToastService) { }

  ngOnInit() {
    this.getAllMovies();
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
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


  deleteMovie() {
    debugger;
    this._movieService.deleteMovie(this.selectedMovie.movieId).subscribe(
      res => { this.toastService.showSuccess(res); },
      error => {
        this.toastService.showError("Something went wrong!!"); console.log(error);
        this.ngOnInit()
      },
      () => { console.log("Edit Movie Run Successfully"); this.ngOnInit() }
    )
    const modal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal')!);
    modal?.hide();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;  // ✅ Just the file name
      console.log('Selected file name:', this.fileName);
    }
  }

  openAddModal() {
    this.editingMovie = false;
    this.fileName = "";
    this.selectedMovie = {};
    new bootstrap.Modal(document.getElementById('editMovieModal')!).show();
    const modalElement = document.getElementById('editMovieModal') as HTMLElement;
    const form = modalElement.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset(); // Resets the form fields
    }
  }

  openEditMovies(movie: Movie) {
    this.selectedMovie = { ...movie }
    this.fileName = movie.posterUrl.split('/').pop();
    this.editingMovie = true;
    new bootstrap.Modal(document.getElementById('editMovieModal')!).show();

  }

  closeModal(form: NgForm) {
    form.resetForm();
    //this.editMovies = false;
    //document.body.style.overflow = '';
  }

  saveMovies() {
    let mov: Movie = {
      title: this.selectedMovie.title,
      movieId: this.selectedMovie.movieId,
      description: this.selectedMovie.description,
      rating: this.selectedMovie.rating,
      posterUrl: "assets/movieImages/" + this.fileName,
      releaseDate: this.selectedMovie.releaseDate,
      feedbacks: this.selectedMovie.feedbacks,
      showtimes: this.selectedMovie.showtimes,
      genre: this.selectedMovie.genre
    }
    if (!this.editingMovie) {
      this._movieService.addMovie(mov).subscribe(
        res => {
          this.toastService.showSuccess(res);
        },
        err => {
          this.toastService.showError("Something went wrong!!"); console.log(err);
          this.ngOnInit()
        },
        () => { console.log("Add Movie Run Successfully"); this.ngOnInit() }
      )
    } else {
      this._movieService.editMovie(mov).subscribe(
        res => {
          this.toastService.showSuccess(res);

        },
        err => {
          this.toastService.showError("Something went wrong!!"); console.log(err);
          this.ngOnInit()
        },
        () => { console.log("Edit Movie Run Successfully"); this.ngOnInit() }
      )
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal')!);
    modal?.hide();
    const modalElement = document.getElementById('editMovieModal') as HTMLElement;
    const form = modalElement.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset(); // Resets the form fields
    }
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
