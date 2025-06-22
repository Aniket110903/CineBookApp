import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ShowtimeDetails } from '../../interfaces/ShowtimeDetails';
import { Movie } from '../../interfaces/Movie';
import { Showtime } from '../../interfaces/Showtime';
import { Theatre } from '../../interfaces/Theatre';

@Injectable({
  providedIn: 'root'
})
export class ViewShowTimingService {

  //theatres: Theatre[] = [];

  constructor(private http: HttpClient) { }

  getShowtimes(date: Date, movieId: number, location: string): Observable<Theatre[]> {

    //console.log(date + " " + movieId + " " + location);
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<Theatre[]>("http://cinebook.runasp.net/api/ShowTiming/ViewShowTiming?date=" + formattedDate + "&movieId=" + movieId + "&location=" + location).pipe(catchError(this.errorHandler));

  }

  getShowTimming(): Observable<Showtime[]> {
    return this.http.get<Showtime[]>("http://cinebook.runasp.net/api/ShowTiming/GetAllShowTiming").pipe(catchError(this.errorHandler));
  }

  addShowTimming(showtime: Showtime): Observable<string> {
    return this.http.post<string>("http://cinebook.runasp.net/api/ShowTiming/AddShowTimings", showtime).pipe(catchError(this.errorHandler));
  }
  editShowTimming(showtime: Showtime): Observable<string> {
    return this.http.put<string>("http://cinebook.runasp.net/api/ShowTiming/UpdateShowTime", showtime).pipe(catchError(this.errorHandler));
  }

  deleteShowTime(showtimeId: string) {
    return this.http.delete<string>("http://cinebook.runasp.net/api/ShowTiming/DeleteShowTime?showTimeId=" + showtimeId).pipe(catchError(this.errorHandler));
  }
  deleteAllPrevShowTime() {
    return this.http.delete<string>("http://cinebook.runasp.net/api/ShowTiming/DeleteAllPrevShowTime").pipe(catchError(this.errorHandler));
  }
  getMovieDetail(movieId: number): Observable<Movie> {
    return this.http.get<Movie>("http://cinebook.runasp.net/api/Movie/getMovieDetails?movieId=" + movieId).pipe(catchError(this.errorHandler));
  }

  getShowtimeDetails(showtimeId: number) {
    return this.http.get<ShowtimeDetails>("http://cinebook.runasp.net/api/ShowTiming/getShowtimeDetails?showtimeId=" + showtimeId).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }
}
