import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { MovieService } from '../../services/Movie/movie.service';

@Component({
  selector: 'app-crousel',
  templateUrl: './crousel.component.html',
  styleUrls: ['./crousel.component.css']
})
export class CrouselComponent {
  slides: Movie[] = [];
  currentIndex = 0;
  autoplayInterval: any;
  angle = 0;
  intervalId: any;
  slideCount = this.slides.length;
  radius = 220;

  constructor(private _movieService: MovieService, private router: Router) { }
  ngOnInit() {

    this.getAllMovies();
  }
  ngOnDestroy() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }

  }
  getAllMovies() {
    this._movieService.getAllMovies().subscribe(
      res => {
        this.slides = res;
        this.startAutoplay();
      },
      err => {
        console.log(err);
      },
      () => console.log("Movies Fetched Successfully"))
  }
  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 2000)
  }
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }
  get visibleSlides() {
    const total = this.slides.length;
    const indexes = [
      (this.currentIndex - 2 + total) % total,
      (this.currentIndex - 1 + total) % total,
      (this.currentIndex) % total,
      (this.currentIndex + 1) % total,
      (this.currentIndex + 2) % total,
    ]
    return indexes.map(i => this.slides[i]);
  };
  getSlideClass(index: number): string {
    return ['far-left ', 'left', 'center', 'right', 'far-right'][index];
  }
  trackBySlide(index: number, slide: any) {
    return slide.id; // unique identifier
  }
  onSlideClick(movieId: number) {
    this.router.navigate(['/viewMovieDetails', movieId])
  }
}
