import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ViewMoviesComponent } from './components/view-movies/view-movies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ViewShowTimingComponent } from './components/view-show-timing/view-show-timing.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { ModifyMoviesComponent } from './components/modify-movies/modify-movies.component';
import { ManageShowtimesComponent } from './components/manage-showtimes/manage-showtimes.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ManageTheatersComponent } from './components/manage-theaters/manage-theaters.component';
import { ViewMovieDetailsComponent } from './components/view-movie-details/view-movie-details.component';
import { SeatMapComponent } from './components/seat-map/seat-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { CrouselComponent } from './components/crousel/crousel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { BookingComponent } from './components/booking/booking.component';
import { ManageFeedbacksComponent } from './components/manage-feedbacks/manage-feedbacks.component';
import { ViewAnalyticsComponent } from './components/view-analytics/view-analytics.component';
import { NotificationPageComponent } from './components/notification-page/notification-page.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { routing } from './app.routes';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ViewShowTimingService } from './services/ViewShowtiming/view-show-timing.service';
import { MovieService } from './services/Movie/movie.service';
import { TheaterService } from './services/Theater/theater.service';
import { UserService } from './services/User/user.service';

@NgModule({
  declarations: [
    BookingHistoryComponent,
    ForgotPassComponent,
    AppComponent,
    SeatMapComponent,
    ViewMoviesComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    FooterComponent,
    AdminNavbarComponent,
    AdminHomeComponent,
    ViewShowTimingComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    UserHomeComponent,
    ModifyMoviesComponent,
    ManageShowtimesComponent,
    RegisterUserComponent,
    ManageTheatersComponent,
    ViewMovieDetailsComponent,
    CrouselComponent,
    UpdateProfileComponent,
    BookingComponent,
    ManageFeedbacksComponent,
    ViewAnalyticsComponent,
    NotificationPageComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule, routing
  ],
  providers: [MovieService, ViewShowTimingService, TheaterService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
