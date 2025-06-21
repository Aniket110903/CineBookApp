import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationSubject = new BehaviorSubject<string | null>(this.getStoredLocation());
  location$ = this.locationSubject.asObservable();
  constructor() { }
  setLocation(location: string) {
    sessionStorage.setItem('location', location);
    this.locationSubject.next(location);
  }

  getStoredLocation(): string | null {
    return sessionStorage.getItem('location');
  }
}
