import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
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
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ManageFeedbacksComponent } from './components/manage-feedbacks/manage-feedbacks.component';
import { UserAuthGuardService } from './services/UserAuthGuard/user-auth-guard.service';
import { GuestAuthGuardService } from './services/GuestAuthGuard/guest-auth-guard.service';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { BookingComponent } from './components/booking/booking.component';
import { NotificationPageComponent } from './components/notification-page/notification-page.component';
import { AuthGuardService } from './services/AuthGuard/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,

    children: [
      {
        path: '',
        component: UserHomeComponent,
        canActivate: [UserAuthGuardService],
      },
      {
        path: 'seatmap/:showtimeId',
        component: SeatMapComponent,
        canActivate: [GuestAuthGuardService, UserAuthGuardService],

      },
      {
        path: 'viewShowTimings',
        component: ViewShowTimingComponent,
        canActivate: [UserAuthGuardService],
      },
      {
        path: 'viewMovieDetails/:movieId',
        component: ViewMovieDetailsComponent,
        canActivate: [UserAuthGuardService],

      },
      {
        path: 'viewShowTiming/:movieId',
        component: ViewShowTimingComponent,
        canActivate: [UserAuthGuardService],
      }, {
        path: 'editProfile',
        component: UpdateProfileComponent,
        canActivate: [GuestAuthGuardService]
      },
      {
        path: 'viewBooking',
        component: BookingHistoryComponent,
        canActivate: [GuestAuthGuardService]
      }, {
        path: 'booking/:showtimeId',
        component: BookingComponent,
        canActivate: [GuestAuthGuardService]
      }, {
        path: 'notifications',
        component: NotificationPageComponent,
        canActivate: [GuestAuthGuardService]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterUserComponent
  },
  {
    path: 'forgotpass',
    component: ForgotPassComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: AdminHomeComponent,
      },
      {
        path: 'home',
        component: AdminHomeComponent
      },
      {
        path: 'modifyMovies',
        component: ModifyMoviesComponent,
      },
      {
        path: 'manageShowTime',
        component: ManageShowtimesComponent,
      },
      {
        path: 'manageTheater',
        component: ManageTheatersComponent,
      }, {
        path: 'editProfile',
        component: UpdateProfileComponent
      }, {
        path: 'manageFeedbacks',
        component: ManageFeedbacksComponent
      }

    ]
  }, {
    path: '**',
    component: UserLayoutComponent,
    canActivate: [UserAuthGuardService],
    children: [{
      path: '**',
      component: UserHomeComponent
    }]
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
