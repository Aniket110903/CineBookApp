import { Component, OnInit } from '@angular/core';
import { Booking } from '../../interfaces/Booking';
import { Movie } from '../../interfaces/Movie';
import { BookingService } from '../../services/Booking/booking.service';
import { MovieService } from '../../services/Movie/movie.service'; 
declare var Chart: any; // Chart.js loaded from CDN


@Component({
  selector: 'app-view-analytics',
  templateUrl: './view-analytics.component.html',
  styleUrls: ['./view-analytics.component.css']
})
export class ViewAnalyticsComponent implements OnInit {

  bookings: Booking[] = [];
  movies: Movie[] = [];
  barChart: any;
  pieChart: any;
  movieBarChart: any;
  moviePieChart: any;
  // Filters
  filterTime: '7days' | 'month' | 'year' | 'all' = '7days';
  filterStatus: 'All' | 'Confirmed' | 'Pending' | 'Cancelled' = 'All';
  movieFilterType: 'reviews' | 'rating' = 'reviews';
  movieTimeFilter: '7days' | 'month' | 'year' | 'all' = 'all';


  constructor(private bookingService: BookingService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.getAllBookings();
    this.getAllMovies(); // load movies
  }


  getAllBookings() {
    this.bookingService.getAllBookings().subscribe(
      res => {
        this.bookings = res;
        this.createCharts();
      },
      err => {
        console.error(err);
      }
    );
  }
  getAllMovies() {
    this.movieService.getAllMovies().subscribe(
      res => {
        this.movies = res;
        this.createMovieCharts();
      },
      err => {
        console.error(err);
      }
    );
  }

  onTimeFilterChange(filter: '7days' | 'month' | 'year' | 'all') {
    this.filterTime = filter;
    this.createCharts();
  }

  onStatusFilterChange(status: 'All' | 'Confirmed' | 'Pending' | 'Cancelled') {
    this.filterStatus = status;
    this.createCharts();
  }

  createCharts() {
    // Filter bookings by status first
    const filteredBookings = this.bookings.filter(b =>
      this.filterStatus === 'All' || b.bookingStatus === this.filterStatus
    );

    // Prepare variables
    let labels: string[] = [];
    let counts: number[] = [];

    const today = new Date();

    if (this.filterTime === '7days') {
      // Last 7 days labels and counts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        return d;
      });

      labels = last7Days.map(d => d.toLocaleDateString());
      counts = last7Days.map(date => {
        const dateStr = date.toISOString().slice(0, 10);
        return filteredBookings.filter(b => b.bookingTime?.slice(0, 10) === dateStr).length;
      });

    } else if (this.filterTime === 'month') {
      // Bookings per day for current month
      const year = today.getFullYear();
      const month = today.getMonth();

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

      counts = labels.map(dayStr => {
        const day = dayStr.padStart(2, '0');
        const datePrefix = `${year}-${(month + 1).toString().padStart(2, '0')}-${day}`;
        return filteredBookings.filter(b => b.bookingTime?.startsWith(datePrefix)).length;
      });

    } else if (this.filterTime === 'year') {
      // Bookings per month for current year
      const year = today.getFullYear();
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      counts = labels.map((_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        const prefix = `${year}-${month}`;
        return filteredBookings.filter(b => b.bookingTime?.startsWith(prefix)).length;
      });

    } else if (this.filterTime === 'all') {
      // Group bookings by year, sorted ascending
      const yearsMap: { [year: string]: number } = {};
      filteredBookings.forEach(b => {
        if (b.bookingTime) {
          const year = new Date(b.bookingTime).getFullYear().toString();
          yearsMap[year] = (yearsMap[year] || 0) + 1;
        }
      });

      labels = Object.keys(yearsMap).sort();
      counts = labels.map(y => yearsMap[y]);
    }

    // Bright colors for datasets
    const brightColors = [
      'rgba(255, 99, 132, 0.8)',   // Bright Red
      'rgba(54, 162, 235, 0.8)',   // Bright Blue
      'rgba(255, 206, 86, 0.8)',   // Bright Yellow
      'rgba(75, 192, 192, 0.8)',   // Bright Teal
      'rgba(153, 102, 255, 0.8)',  // Bright Purple
      'rgba(255, 159, 64, 0.8)',   // Bright Orange
      'rgba(0, 200, 83, 0.8)',     // Bright Green
      'rgba(233, 30, 99, 0.8)',    // Bright Pink
      'rgba(0, 188, 212, 0.8)',    // Bright Cyan
      'rgba(156, 39, 176, 0.8)'    // Bright Violet
    ];

    const backgroundColors = labels.map((_, i) => brightColors[i % brightColors.length]);
    const borderColors = backgroundColors.map(c => c.replace(/0\.8/, '1'));

    // Bar chart
    const barCtx = (document.getElementById('bookingBarChart') as HTMLCanvasElement)?.getContext('2d');
    if (!barCtx) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Number of Bookings',
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // hide color box
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    // Pie chart
    const pieCtx = (document.getElementById('bookingPieChart') as HTMLCanvasElement)?.getContext('2d');
    if (!pieCtx) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }
  createMovieCharts() {
    const today = new Date();
    let filteredMovies = [...this.movies];
    console.log(filteredMovies);

    // Filter movies based on feedback submission date instead of release date
    filteredMovies = filteredMovies.filter(m => {
      if (!m.feedbacks || m.feedbacks.length === 0) return false;

      // Check if any feedback falls within the selected timeframe
      return m.feedbacks.some(fb => {
        const submittedAt = new Date(fb.submittedAt);

        if (this.movieTimeFilter === '7days') {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return submittedAt >= sevenDaysAgo && submittedAt <= today;
        } else if (this.movieTimeFilter === 'month') {
          return submittedAt.getMonth() === today.getMonth() &&
            submittedAt.getFullYear() === today.getFullYear();
        } else if (this.movieTimeFilter === 'year') {
          return submittedAt.getFullYear() === today.getFullYear();
        }

        return true; // 'all' - include all
      });
    });

    // Sort movies based on filter type
    filteredMovies.sort((a, b) => {
      if (this.movieFilterType === 'reviews') {
        return (b.feedbacks?.length || 0) - (a.feedbacks?.length || 0);
      } else {
        return (b.rating || 0) - (a.rating || 0);
      }
    });

    // Top 5
    const topMovies = filteredMovies.slice(0, 5);

    // Chart Data
    const labels = topMovies.map(m => m.title);
    const data = this.movieFilterType === 'reviews'
      ? topMovies.map(m => m.feedbacks?.length || 0)
      : topMovies.map(m => m.rating || 0);

    const colors = ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0', '#9966ff'];

    // Destroy existing charts if present
    if (this.movieBarChart) this.movieBarChart.destroy();
    if (this.moviePieChart) this.moviePieChart.destroy();

    // BAR CHART
    const barCtx = (document.getElementById('movieBarChart') as HTMLCanvasElement)?.getContext('2d');
    if (barCtx) {
      this.movieBarChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: this.movieFilterType === 'reviews' ? 'Number of Reviews' : 'Average Rating',
            data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // PIE CHART
    const pieCtx = (document.getElementById('moviePieChart') as HTMLCanvasElement)?.getContext('2d');
    if (pieCtx) {
      this.moviePieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true }
          }
        }
      });
    }
  }

  //createMovieCharts() {
  //  const today = new Date();
  //  let filteredMovies = [...this.movies];
  //  console.log(filteredMovies)
  //  debugger;
  //  // Filter movies based on selected timeframe
  //  filteredMovies = filteredMovies.filter(m => {
  //    const releaseDate = new Date(m.releaseDate);
  //    if (this.movieTimeFilter === '7days') {
  //      const sevenDaysAgo = new Date(today);
  //      sevenDaysAgo.setDate(today.getDate() - 7);
  //      return releaseDate >= sevenDaysAgo && releaseDate <= today;
  //    } else if (this.movieTimeFilter === 'month') {
  //      return releaseDate.getMonth() === today.getMonth() &&
  //        releaseDate.getFullYear() === today.getFullYear();
  //    } else if (this.movieTimeFilter === 'year') {
  //      return releaseDate.getFullYear() === today.getFullYear();
  //    }
  //    // 'all' - no filtering
  //    return true;
  //  });

  //  // Sort movies based on filter type
  //  filteredMovies.sort((a, b) => {
  //    if (this.movieFilterType === 'reviews') {
  //      return (b.feedbacks?.length || 0) - (a.feedbacks?.length || 0);
  //    } else {
  //      return (b.rating || 0) - (a.rating || 0);
  //    }
  //  });

  //  // Top 5
  //  const topMovies = filteredMovies.slice(0, 5);

  //  // Chart Data
  //  const labels = topMovies.map(m => m.title);
  //  const data = this.movieFilterType === 'reviews'
  //    ? topMovies.map(m => m.feedbacks?.length || 0)
  //    : topMovies.map(m => m.rating || 0);

  //  const colors = ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0', '#9966ff'];

  //  // Destroy existing charts if present
  //  if (this.movieBarChart) this.movieBarChart.destroy();
  //  if (this.moviePieChart) this.moviePieChart.destroy();

  //  // BAR CHART
  //  const barCtx = (document.getElementById('movieBarChart') as HTMLCanvasElement)?.getContext('2d');
  //  if (barCtx) {
  //    this.movieBarChart = new Chart(barCtx, {
  //      type: 'bar',
  //      data: {
  //        labels,
  //        datasets: [{
  //          label: this.movieFilterType === 'reviews' ? 'Number of Reviews' : 'Average Rating',
  //          data,
  //          backgroundColor: colors,
  //          borderColor: colors,
  //          borderWidth: 1
  //        }]
  //      },
  //      options: {
  //        responsive: true,
  //        maintainAspectRatio: false,
  //        plugins: {
  //          legend: { display: false },
  //          tooltip: { enabled: true }
  //        },
  //        scales: {
  //          y: {
  //            beginAtZero: true
  //          }
  //        }
  //      }
  //    });
  //  }

  //  // PIE CHART
  //  const pieCtx = (document.getElementById('moviePieChart') as HTMLCanvasElement)?.getContext('2d');
  //  if (pieCtx) {
  //    this.moviePieChart = new Chart(pieCtx, {
  //      type: 'pie',
  //      data: {
  //        labels,
  //        datasets: [{
  //          data,
  //          backgroundColor: colors,
  //          borderColor: colors,
  //          borderWidth: 1
  //        }]
  //      },
  //      options: {
  //        responsive: true,
  //        maintainAspectRatio: false,
  //        plugins: {
  //          legend: { position: 'bottom' },
  //          tooltip: { enabled: true }
  //        }
  //      }
  //    });
  //  }
  //}

}
