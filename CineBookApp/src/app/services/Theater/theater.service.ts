import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Theatre } from '../../interfaces/Theatre';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {

  constructor(private http: HttpClient) { }

  getAllTheaters(): Observable<Theatre[]> {
    return this.http.get<Theatre[]>("https://localhost:44325/api/Theater/GetAllTheaters").pipe(catchError(this.errorHandler));
  }
  addTheatre(theater: Theatre): Observable<string> {
    return this.http.post<string>("https://localhost:44325/api/Theater/AddTheater", theater).pipe(catchError(this.errorHandler));
  }
  updateTheater(theater: Theatre): Observable<string> {
    return this.http.put<string>("https://localhost:44325/api/Theater/UpdateTheater", theater).pipe(catchError(this.errorHandler));
  }
  deleteTheater(theaterId: number): Observable<string> {
    return this.http.delete<string>("https://localhost:44325/api/Theater/DeleteTheater?id=" + theaterId).pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }
}
