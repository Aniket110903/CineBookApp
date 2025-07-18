import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor(private http: HttpClient) { }
  getSeatsByShowTime(showtimeId: number): Observable<{ [row: string]: any[] }> {
    return this.http.get<any>(`http://cinebook.runasp.net/api/Seats/GetSeatByShowTime?showtimeId=${showtimeId}`);
  }
}
