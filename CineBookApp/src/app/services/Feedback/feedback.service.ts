import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Feedbacks } from '../../interfaces/Feedbacks';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(private http: HttpClient) { }
  getAllFeedbacks(): Observable<Feedbacks[]> {
    return this.http.get<Feedbacks[]>("https://localhost:44325/api/Feedback/GetAllFeedbacks").pipe(catchError(this.errorHandler));
  }
  deleteFeedbacks(id: number): Observable<string> {
    return this.http.delete<string>("https://localhost:44325/api/Feedback/DeleteFeedback?feedbackId=" + id).pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    //To do implement necessary logic
    console.log(error);
    return throwError(error.message || 'ERROR')

  }

}
