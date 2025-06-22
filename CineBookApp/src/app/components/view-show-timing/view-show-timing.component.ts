import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewShowTimingService } from '../../services/ViewShowtiming/view-show-timing.service';
import { MovieService } from '../../services/Movie/movie.service';
import { LocationService } from '../../services/Location/location.service';
import { ToastService } from '../../services/Toast/toast.service';

@Component({
  selector: 'app-view-show-timing',
  templateUrl: './view-show-timing.component.html',
  styleUrls: ['./view-show-timing.component.css']
})
export class ViewShowTimingComponent {
  movieId: number = 0;
  movie: any;
  dates: Date[] = [];
  selectedDate: Date = new Date();
  theatres: any = [];
  //movieId!: number;
  location!: string;
  constructor
    (
      private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewShowTimeService: ViewShowTimingService,
    private ToastService: ToastService,
    private locationService: LocationService,
    private movieService: MovieService,
  ) { }
    ngOnInit(): void {
    // You can access route parameters if needed
    this.activatedRoute.params.subscribe(params => {
      this.movieId = +params['movieId']; 
    });

      if (this.movieId) {
        this.getMovieDetails();
        this.generateWeekDates();
        this.locationService.location$.subscribe(loc => {
          if (loc) {
            this.location = loc;
            this.fetchTheatres(this.selectedDate);
          }
        });
      }
      else {
        this.ToastService.showError('Movie ID is not provided.');
        this.router.navigate(['/']);
      }
    }
  generateWeekDates(): void {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      this.dates.push(date);
    }
  }
  fetchTheatres(date: Date): void {
    this.viewShowTimeService.getShowtimes(date, this.movieId, this.location).subscribe(
      data => {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        // If today, filter out showtimes that ended before current time
        if (isToday) {
          this.theatres = data.map(theatre => ({
            ...theatre,
            showtimes: (theatre.showtimes || []).filter(show =>
              new Date(show.endTime) > today
            )
          }));
        } else {
          this.theatres = data;
        }
      },
      err => {
        console.error('Error fetching showtimes:', err);
        this.ToastService.showError('Failed to fetch showtimes. Please try again later.');
  }
    );
  }
  getMovieDetails() {
    this.movieService.getMovieDetais(this.movieId).subscribe(
      res => {
        this.movie = res;
      },
      error => {
        console.error('Error fetching movie details:', error);
        this.ToastService.showError('Failed to fetch movie details. Please try again later.'
        )
      },
      () => { console.log('Movie details fetched successfully.'); }
    );
  }
  onDateSelect(date: Date): void {
    this.selectedDate = date;
    this.fetchTheatres(date);
  }
  goBack(): void {
    this.router.navigate(['/viewMovieDetails',this.movieId]);
  }
  NavigateToSeatMap(showtimeId: string) {
    debugger;
    this.router.navigate(['/seatmap', showtimeId]);
  }
}
