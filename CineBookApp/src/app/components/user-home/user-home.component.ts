import { Component } from '@angular/core';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent {
  currentIndex = 2; // center image
  images = [
    'assets/movieImages/Superman.jpg',
    'assets/movieImages/Superman.jpg',
    'assets/movieImages/Superman.jpg',
    'assets/movieImages/Superman.jpg',
    'assets/movieImages/Superman.jpg'
  ];
  getItemClass(index: number): string {
    const position = index - this.currentIndex;

    switch (position) {
      case 0:
        return 'center';
      case -1:
      case 1:
        return position === -1 ? 'left' : 'right';
      case -2:
      case 2:
        return position === -2 ? 'far-left' : 'far-right';
      default:
        return '';
    }
  }

  ngOnInit() {
    const carousel = document.querySelector('.movie-carousel-wrapper');
    if (carousel) {
      setInterval(() => {
        carousel.scrollBy({ left: 220, behavior: 'smooth' });
      }, 3000);
    }
  }
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
}
