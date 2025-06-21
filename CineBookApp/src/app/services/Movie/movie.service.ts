import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Feedbacks } from '../../interfaces/Feedbacks';
import { Movie } from '../../interfaces/Movie';
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient) { }

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>("http://cinebook.runasp.net/api/Movie/GetAllMovies").pipe(catchError(this.errorHandler));
  }

  addMovie(movie: Movie): Observable<string> {
    return this.http.post<string>("http://cinebook.runasp.net/api/Movie/AddMovie", movie).pipe(catchError(this.errorHandler));
  }

  editMovie(movie: Movie): Observable<string> {
    return this.http.put<string>("http://cinebook.runasp.net/api/Movie/UpdateMovie", movie).pipe(catchError(this.errorHandler));
  }
  getMovieDetais(MovieId: number): Observable<Movie> {
    return this.http.get<Movie>("http://cinebook.runasp.net/api/Movie/GetMovieDetails?movieId=" + MovieId).pipe(catchError(this.errorHandler));
  }
  deleteMovie(MovieId: string) {
    return this.http.delete<string>("http://cinebook.runasp.net/api/Movie/DeleteMovie?MovieId=" + MovieId).pipe(catchError(this.errorHandler));
  }
  AddRating(rate: Feedbacks): Observable<string> {
    return this.http.post<string>("http://cinebook.runasp.net/api/Feedback/AddRating", rate).pipe(catchError(this.errorHandler));
  }



  errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }
}
