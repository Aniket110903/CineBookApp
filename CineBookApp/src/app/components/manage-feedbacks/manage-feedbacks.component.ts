import { Component, OnInit } from '@angular/core';
import { Feedbacks } from '../../interfaces/Feedbacks';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { FeedbackService } from '../../services/Feedback/feedback.service';
import { MovieService } from '../../services/Movie/movie.service';
import { ToastService } from '../../services/Toast/toast.service';

// Required for Bootstrap modal
declare var bootstrap: any;

@Component({
  selector: 'app-manage-feedbacks',
  templateUrl: './manage-feedbacks.component.html',
  styleUrls: ['./manage-feedbacks.component.css']
})
export class ManageFeedbacksComponent implements OnInit {
  feedbacks: Feedbacks[] = [];
  movies: Movie[] = [];
  selectedMovieId: number | null = null;
  filteredFeedbacks: Feedbacks[] = [];

  pageSize = 5;
  currentPage = 1;
  displayedFeedbacks: Feedbacks[] = [];

  private selectedReviewToDelete: Feedbacks | null = null;

  constructor(
    private feedbackService: FeedbackService,
    private movieService: MovieService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllMovies();
    this.getFeedbacks();
  }

  getAllMovies(): void {
    this.movieService.getAllMovies().subscribe(
      res => this.movies = res,
      err => console.error(err)
    );
  }

  getFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
      res => {
        this.feedbacks = res;
        this.applyFilterAndPagination();
      },
      err => console.error(err)
    );
  }

  onMovieSelect(movieId: number | string): void {
    this.selectedMovieId = Number(movieId);
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  applyFilterAndPagination(): void {
    if (this.selectedMovieId && this.selectedMovieId !== 0) {
      this.filteredFeedbacks = this.feedbacks.filter(fb => fb.movieId === this.selectedMovieId);
    } else {
      this.filteredFeedbacks = [];
    }

    const source = (this.selectedMovieId && this.selectedMovieId !== 0) ? this.filteredFeedbacks : this.feedbacks;
    const maxPage = Math.ceil(source.length / this.pageSize) || 1;
    if (this.currentPage > maxPage) this.currentPage = maxPage;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedFeedbacks = source.slice(start, end);
  }

  get totalPages(): number {
    const source = (this.selectedMovieId && this.selectedMovieId !== 0) ? this.filteredFeedbacks : this.feedbacks;
    return Math.ceil(source.length / this.pageSize) || 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilterAndPagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  openDeleteModal(review: Feedbacks): void {
    this.selectedReviewToDelete = review;
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmDelete(): void {
    if (!this.selectedReviewToDelete) return;

    this.feedbackService.deleteFeedbacks(this.selectedReviewToDelete.feedbackId).subscribe(
      () => {
        this.feedbacks = this.feedbacks.filter(fb => fb.feedbackId !== this.selectedReviewToDelete!.feedbackId);
        this.filteredFeedbacks = this.filteredFeedbacks.filter(fb => fb.feedbackId !== this.selectedReviewToDelete!.feedbackId);
        this.toastService.showSuccess('Feedback deleted successfully.');

        const source = (this.selectedMovieId && this.selectedMovieId !== 0) ? this.filteredFeedbacks : this.feedbacks;
        const maxPage = Math.ceil(source.length / this.pageSize) || 1;
        const start = (this.currentPage - 1) * this.pageSize;

        // If current page becomes empty and not page 1, go back
        if (start >= source.length && this.currentPage > 1) {
          this.currentPage--;
        }

        this.applyFilterAndPagination();

        // Close modal
        const modalElement = document.getElementById('deleteConfirmModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }

        this.selectedReviewToDelete = null;
      },
      err => {
        console.error(err);
        this.toastService.showError('Failed to delete feedback.');
      }
    );
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
