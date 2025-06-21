import { Component } from '@angular/core';
import { Feedbacks } from '../../interfaces/Feedbacks';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/Movie/movie.service';
import { ToastService } from '../../services/Toast/toast.service';

@Component({
  selector: 'app-view-movie-details',
  templateUrl: './view-movie-details.component.html',
  styleUrls: ['./view-movie-details.component.css']
})
export class ViewMovieDetailsComponent {
  movie: any;
  movieId: number = 0;
  feedback = {
    feedbackId: 0,
    movieId: 0,
    userId: 0,
    comment: '',
    rating: 0,
    submittedAt: new Date()
  };

  showFeedbackModal: boolean = false;
  stars = Array.from({ length: 10 }, (_, i) => i + 1);
  userData: any;
  isLoading = true;
  errorMessage = '';
  error: string = "";
  userId: any;
  ratingTouched: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const movieIdParam = params.get('movieId');
      if (movieIdParam) {
        this.movieId = +movieIdParam;
        this.getMovieDetail();
        window.scrollTo(0, 0);
      } else {
        this.router.navigate(['/home']);
      }
    });
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userData = parsedUser;
      this.userId = parsedUser.userId;
    }
  }

  getMovieDetail() {
    this.movieService.getMovieDetais(this.movieId).subscribe(
      res => {
        this.movie = res;
        this.movie.feedbacks.sort((a: any, b: any) => {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        });
        this.isLoading = false;
      },
      err => {
        this.error = 'Could not load movie details';
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  rateMovie(): void {
    if (this.userData) {
      this.ratingTouched = false;
      console.log("rate movie clicked");
      this.feedback.userId = this.userId ? +this.userId : 0;
      this.feedback.movieId = this.movieId;
      this.feedback.comment = '';
      this.showFeedbackModal = true;
      this.feedback.rating = 0;
    } else {
      this.toastService.showError("You are not logged In!");
    }
  }

  setRating(star: number): void {
    this.feedback.rating = star;
    this.ratingTouched = true;
  }

  submitFeedback(feedbackForm: NgForm): void {
    this.ratingTouched = true;

    if (this.feedback.comment && this.feedback.rating > 0) {
      const userFeedback: Feedbacks = {
        feedbackId: this.feedback.feedbackId,
        userId: this.feedback.userId,
        movieId: this.feedback.movieId,
        rating: this.feedback.rating,
        comments: this.feedback.comment,
        submittedAt: this.feedback.submittedAt
      };

      this.movieService.AddRating(userFeedback).subscribe(
        res => {
          if (res === 'Successful Added rating') {
            this.toastService.showSuccess("Successfully Added Rating");
            this.getMovieDetail(); // refresh user reviews
          } else {
            this.toastService.showError("Failed to Add Rating");
          }
          this.closeModal();
          feedbackForm.resetForm();
        },
        err => {
          console.error(err);
          this.toastService.showError("Something went wrong");
          feedbackForm.resetForm();
          this.closeModal();
        }
      );
    } else {
      // Don't use alert — form HTML handles showing validation
      this.toastService.showError("Please complete all fields.");
    }
  }

  closeModal(): void {
    this.showFeedbackModal = false;
    this.feedback.comment = '';
    this.feedback.rating = 0;
    this.ratingTouched = false;
  }

  bookTicket(): void {
    console.log("book ticket clicked");
    this.router.navigate(['/viewShowTiming', this.movieId]);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
