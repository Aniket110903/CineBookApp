
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../interfaces/Movie';
import { MovieService } from '../../services/Movie/movie.service';

@Component({
  selector: 'app-crousel',
  templateUrl: './crousel.component.html',
  styleUrls: ['./crousel.component.css']
})
export class CrouselComponent implements OnInit, OnDestroy {
  slides: Movie[] = [];
  currentIndex = 0;
  autoplayInterval: any;
  angle = 0;
  intervalId: any;
  slideCount = this.slides.length;
  radius = 220;
  isMobile = false;
  isTablet = false;

  constructor(private _movieService: MovieService, private router: Router) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 480;
    this.isTablet = width > 480 && width <= 768;
  }

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
    // Slower autoplay on mobile for better UX
    const interval = this.isMobile ? 3000 : 2000;
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, interval);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  get visibleSlides() {
    if (!this.slides || this.slides.length === 0) {
      return [];
    }

    const total = this.slides.length;
    let indexes: number[];

    if (this.isMobile) {
      // Show only 3 slides on mobile
      indexes = [
        (this.currentIndex - 1 + total) % total,
        (this.currentIndex) % total,
        (this.currentIndex + 1) % total,
      ];
    } else {
      // Show 5 slides on desktop and tablet
      indexes = [
        (this.currentIndex - 2 + total) % total,
        (this.currentIndex - 1 + total) % total,
        (this.currentIndex) % total,
        (this.currentIndex + 1) % total,
        (this.currentIndex + 2) % total,
      ];
    }

    return indexes.map(i => this.slides[i]).filter(slide => slide);
  }

  getSlideClass(index: number): string {
    if (this.isMobile) {
      return ['left', 'center', 'right'][index];
    } else {
      return ['far-left', 'left', 'center', 'right', 'far-right'][index];
    }
  }

  trackBySlide(index: number, slide: any) {
    return slide?.id || slide?.movieId || index;
  }

  onSlideClick(movieId: number) {
    this.router.navigate(['/viewMovieDetails', movieId]);
  }

  // Manual navigation methods for mobile
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
