import { Component, OnInit } from '@angular/core';
import { Booking } from '../../interfaces/Booking';
import { Router } from '@angular/router';
import { BookingService } from '../../services/Booking/booking.service';
import { ToastService } from '../../services/Toast/toast.service';
@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  selectedBooking: Booking | null = null;
  cancelBooking: Booking | null = null;
  showCancelConfirmation = false;
  refundAmount = 0;
  error = '';
  showFilterBar = false;
  selectedStatus: string = '';
  selectedTimeline: string = '';
  originalBookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user && user.userId) {
      this.bookingService.getBookingHistory(user.userId).subscribe({
        next: (bookings: Booking[]) => {
          this.originalBookings = bookings;
          this.bookings = [...bookings];
          this.error = bookings.length === 0 ? 'No booking history found.' : '';
        },
        error: () => {
          this.error = 'Failed to fetch booking history';
        }
      });
    } else {
      this.error = 'User not logged in.';
    }
  }

  toggleFilterBar(): void {
    this.showFilterBar = !this.showFilterBar;
  }

  applyFilter(): void {
    const now = new Date();
    let filtered = [...this.originalBookings];

    if (this.selectedStatus) {
      filtered = filtered.filter(
        b => b.bookingStatus?.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    if (this.selectedTimeline) {
      const fromDate = new Date();
      if (this.selectedTimeline === '1week') {
        fromDate.setDate(now.getDate() - 7);
      } else if (this.selectedTimeline === '1month') {
        fromDate.setMonth(now.getMonth() - 1);
      } else if (this.selectedTimeline === '1year') {
        fromDate.setFullYear(now.getFullYear() - 1);
      }

      filtered = filtered.filter(
        b => new Date(b.showtime.startTime) >= fromDate
      );
    }

    this.bookings = filtered;
    this.showFilterBar = false;
  }

  showDetailsModal(booking: Booking): void {
    this.selectedBooking = booking;
    document.body.classList.add('modal-open');
  }

  closeDetailsModal(): void {
    this.selectedBooking = null;
    this.closeCancelModal();
    document.body.classList.remove('modal-open');
  }

  openCancelModal(booking: Booking): void {
    if (!this.canCancel(booking)) {
      this.toastService.showError(
        "Only 'Confirmed' bookings at least 12 hours before showtime can be cancelled."
      );
      return;
    }

    // Close booking modal visually first
    this.selectedBooking = null;
    document.body.classList.remove('modal-open');

    // Use setTimeout to wait for modal to disappear
    setTimeout(() => {
      this.cancelBooking = booking;
      this.refundAmount = this.getRefundAmount(booking.totalAmount);
      this.showCancelConfirmation = true;
    }, 100); // 100ms is enough
  }


  closeCancelModal(): void {
    this.cancelBooking = null;
    this.showCancelConfirmation = false;
  }

  confirmCancel(): void {
    if (!this.cancelBooking) return;

    this.bookingService.cancelBooking(this.cancelBooking.bookingId).subscribe({
      next: (stat: string) => {
        if (stat === "Booking cancelled successfully.") {
          this.toastService.showSuccess(`Ticket cancelled successfully. ₹${this.refundAmount} will be refunded.`);
          this.bookings = this.bookings.map(b =>
            b.bookingId === this.cancelBooking!.bookingId
              ? { ...b, bookingStatus: 'Cancelled' }
              : b
          );
          this.closeCancelModal();
        }
      },
      error: () => {
        this.toastService.showError('Failed to cancel booking.');
      }
    }
    );
  }
  proceedToPayment(booking: any): void {
    this.router.navigate(['/booking', booking.showtime.showtimeId]);
  }
  canCancel(booking: Booking): boolean {
    debugger;
    const status = booking.bookingStatus?.toLowerCase();
    if (status !== 'confirmed') return false;
    const paymentTime = booking.payments?.[0]?.paymentTime
      ? new Date(booking.payments[0].paymentTime)
      : null;
    const showTime = new Date(booking.showtime.startTime);
    const now = new Date();
    const hoursLeft = (showTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const paymentHourLeft = ((paymentTime?.getTime() ?? 0) - now.getTime()) / (1000 * 60 * 60);

    return hoursLeft >= 24 && paymentHourLeft <= 12;
  }

  getRefundAmount(amount: number): number {
    return Math.round(amount * 0.9); // Deduct 10% fee
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
