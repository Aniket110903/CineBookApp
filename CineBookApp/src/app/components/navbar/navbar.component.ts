import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { LocationService } from '../../services/Location/location.service';
import { MovieService } from '../../services/Movie/movie.service';
import { NotificationService } from '../../services/Notification/notification.service';
import { NotificationServService } from '../../services/NotificationServ/notification-serv.service';
import { TheaterService } from '../../services/Theater/theater.service';
import { ToastService } from '../../services/Toast/toast.service';


declare var bootstrap: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  selectedLocation: string = 'Delhi-NCR';
  unreadNotificationsCount: number = 0; // example count, update dynamically
  chunkedLocations: string[][] = [];
  searchQuery: string = '';
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  isLoggedIn: boolean = false;
  userName: string = '';
  showDropdown: boolean = false;
  locations: string[] = [];
  user: any;
  modalInstance: any;
  constructor(private NotificationAPIs: NotificationServService, private notificationService: NotificationService, private _theaterService: TheaterService, private toastService: ToastService, private router: Router, private _movieService: MovieService, private locationService: LocationService) { }
  ngOnInit() {
    const initialLocation = this.locationService.getStoredLocation();
    if (initialLocation) {
      this.selectedLocation = initialLocation;
    }
    if (!initialLocation) {
      this.modalInstance = new bootstrap.Modal(document.getElementById('locationModal'));
      this.openModal();
    }
    this.getAllTheaters();
    this.getAllMovies();
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.isLoggedIn = true;
      this.user = parsedUser;
      const name = parsedUser.firstName || 'User';
      this.userName = name.length > 15
        ? name.slice(0, 8) + '...'
        : name;  // fallback if name is missing
      this.loadNotificationsOnFirstLogin();

    }
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotificationsCount = count;
    });
  }
  getAllTheaters() {
    this._theaterService.getAllTheaters().subscribe(
      res => {
        if (res != null) {
          //this.theaters = res;
          //this.filteredTheaters = this.theaters;
          //console.log(this.theaters);
          const allLocations = res.map(theater => theater.location);
          this.locations = Array.from(new Set(allLocations));
          this.chunkedLocations = this.chunkArray(this.locations, 5);
        }
      },
      error => { this.toastService.showError("Something went wrong!!"); console.log(error) },
      () => { console.log("Get All Theaters Run Successfully"); }
    )
  }
  goToChangePassword() {
    this.router.navigate(['/forgotpass']);
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  goToBookingHistory(): void {
    // Assuming you have Angular Router injected
    this.router.navigate(['/viewBooking']);
  }


  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToSignup() {
    this.router.navigate(['/register']);
  }
  selectLocation(location: string) {
    this.selectedLocation = location;
    this.locationService.setLocation(location);
    this.closeModal();
  }

  filterMovies() {
    const query = this.searchQuery.toLowerCase().trim();
    const allMatches = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(query)
    );

    this.filteredMovies = allMatches.slice(0, 5);
  }
  navigateToMovie(movieId: number) {
    this.showDropdown = false;
    this.router.navigate(['/viewMovieDetails', movieId]);
  }
  hideDropdownDelayed() {
    // Small delay to allow click before hiding
    setTimeout(() => this.showDropdown = false, 200);
  }
  getAllMovies() {
    this._movieService.getAllMovies().subscribe(
      res => {
        this.movies = res;
      },
      err => {
        console.log(err);
        this.toastService.showError("Something went wrong!!");
      },
      () => console.log("Movies Fetched Successfully"))
  }
  logout(): void {
    sessionStorage.removeItem("user"); // or sessionStorage.removeItem('user');
    // or route to login
    this.toastService.showSuccess("Successfully logged out.");
    this.isLoggedIn = false;
    this.notificationService.resetNotifications();
    this.ngOnInit();
    this.router.navigate(['']);
  }

  openModal(): void {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
  EditProfle() {
    this.router.navigate(['/editProfile']);
  }
  chunkArray(arr: string[], chunkSize: number): string[][] {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  loadNotificationsOnFirstLogin() {
    if (!this.notificationService.getShown()) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const parse = JSON.parse(user);
        const userId = parse.userId;

        this.notificationService.fetchNotifications(userId);
        this.notificationService.setShown();
      }
    }
  }
  fetchNotifications() {

  }
  goToNotification() {
    this.router.navigate(['notifications'])
  }
}
