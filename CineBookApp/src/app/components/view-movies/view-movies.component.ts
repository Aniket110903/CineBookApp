import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { MovieService } from '../../services/Movie/movie.service';
@Component({
  selector: 'app-view-movies',
  templateUrl: './view-movies.component.html',
  styleUrls: ['./view-movies.component.css']
})
export class ViewMoviesComponent {
  movies: Movie[] = [];
  constructor(private _movieService: MovieService, private router: Router) { }
  ngOnInit() {
    this.getAllMovies();
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
  viewMovieDetail(movieId: number) {
    const user = sessionStorage.getItem("user");
    if (user != null) {
      const parsed = JSON.parse(user);
      if (parsed.role == "Admin") {
        this.router.navigate(['/admin/modifyMovies']);
      } else {
        this.router.navigate(['/viewMovieDetails', movieId])
      }
    } else {
      this.router.navigate(['/viewMovieDetails', movieId])
    }

  }
}
