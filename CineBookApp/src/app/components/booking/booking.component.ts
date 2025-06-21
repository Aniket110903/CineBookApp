 // ... existing imports ...
 import { Component, AfterViewInit } from '@angular/core';
 import { Router, ActivatedRoute } from '@angular/router';
 import { AddBooking } from '../../interfaces/AddBooking';
 import { Seat } from '../../interfaces/Seat';
 import { NotificationService } from '../../services/Notification/notification.service';
 import { Notification } from '../../interfaces/Notification';
import { BookingService } from '../../services/Booking/booking.service';
import { NotificationServService } from '../../services/NotificationServ/notification-serv.service';
import { ToastService } from '../../services/Toast/toast.service';
import { ViewShowTimingService } from '../../services/ViewShowtiming/view-show-timing.service';
import { UserService } from '../../services/User/user.service';

 declare var bootstrap: any;
 declare var Razorpay: any;

 @Component({
   selector: 'app-booking',
   templateUrl: './booking.component.html',
   styleUrls: ['./booking.component.css']
 })
 export class BookingComponent implements AfterViewInit {
   showtimeId: number = 0;
   showtime: any;
   selectedSeats: any[] = [];
   convenienceFee: number = 0;
   gstOnFee: number = 0;
   grandTotal: number = 0;
   totalPrice: number = 0;
   user: any;
   bookingId: number = 0;
   totalAmount: number = 0;
   razorpayId: number = 0;

   applyLoyalty: boolean = false;
   loyaltyPoints: number = 0;
   loyaltyPointsValue: number = 0;

   private modalInstance: any;

   constructor(
     private toastService: ToastService,
     private router: Router,
     private _showTimeService: ViewShowTimingService,
     private route: ActivatedRoute,
     private _bookingService: BookingService,
     private loginService: UserService,
     private notification: NotificationServService,
     private notificationService: NotificationService
   ) { }

   ngOnInit(): void {
     this.showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));

     const seats = sessionStorage.getItem("seats");
     if (!seats) {
       this.toastService.showError("No seats selected");
       this.router.navigate(["seatmap/", this.showtimeId]);
       return;
     }

     this.selectedSeats = JSON.parse(seats);

     const userData = sessionStorage.getItem("user");
     if (userData) {
       this.user = JSON.parse(userData);
     }

     this.fetchLoyaltyPoints();
     this.getShowtimeDetails();
     this.calculateTotalPrice();
   }

   ngAfterViewInit(): void {
     const tooltips = [].slice.call(document.querySelectorAll('[title]'));
     tooltips.map((el: HTMLElement) => new bootstrap.Tooltip(el));

     const modalEl = document.getElementById('bookingConfirmationModal');
     if (modalEl) {
       this.modalInstance = new bootstrap.Modal(modalEl);
     }
   }

   fetchLoyaltyPoints(): void {
     this.loyaltyPoints = Number(this.user.loyaltyPoints || 0);
     this.loyaltyPointsValue = this.loyaltyPoints * 1; // ₹1 per point
   }

   onLoyaltyToggle(): void {
     this.calculateTotalPrice();
   }

   getShowtimeDetails(): void {
     this._showTimeService.getShowtimeDetails(this.showtimeId).subscribe(
       res => this.showtime = res,
       err => {
         this.toastService.showError("Failed to fetch showtime details.");
         console.error(err);
       }
     );
   }

   calculateTotalPrice(): void {
     const basePrice = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
     this.totalPrice = basePrice;

     const feeRate = basePrice > 1000 ? 0.10 : 0.15;
     this.convenienceFee = +(basePrice * feeRate).toFixed(2);
     this.gstOnFee = +(this.convenienceFee * 0.18).toFixed(2);

     const rawTotal = basePrice + this.convenienceFee + this.gstOnFee;
     this.grandTotal = this.applyLoyalty ? Math.max(0, rawTotal - this.loyaltyPointsValue) : rawTotal;
   }

   proceedToPayment(): void {
     const seats: Seat[] = this.selectedSeats.map(seat => ({
       seatId: seat.seatId,
       seatNumber: seat.seatNumber,
       rowLabel: seat.rowLabel,
       price: seat.price,
       isOccupies: seat.isOccupies
     }));

     const booking: AddBooking = {
       UserId: this.user.userId,
       ShowtimeId: this.showtimeId,
       TotalAmount: this.grandTotal,
       BookingStatus: "Pending",
       Seats: seats
     };

     this._bookingService.AddBooking(booking).subscribe(
       res => {
         const razorpayOrderId = res.razorpayOrderId;
         this.bookingId = res.bookingId;
         const seatIds = seats.map(s => s.seatId);

         this.pay(razorpayOrderId, this.grandTotal, seatIds);
       },
       err => {
         this.toastService.showError("Failed to create booking.");
         console.error(err);
       }
     );
   }

   pay(orderId: string, amount: number, seatIds: number[]): void {
     const options = {
       key: 'rzp_test_7uuY3OrccXOkSW',
       amount: amount * 100,
       currency: 'INR',
       name: 'CineBook',
       description: 'Movie Ticket Booking',
       order_id: orderId,
       handler: (response: any) => {
         this._bookingService.ConfirmBooking(
           this.bookingId,
           seatIds,
           response.razorpay_payment_id,
           response.razorpay_order_id,
           response.razorpay_signature,
           "captured",
           this.applyLoyalty,
           this.user.userId
         ).subscribe(
           (res) => {
             this.razorpayId = response.razorpay_payment_id;
             this.totalAmount = amount;
             sessionStorage.removeItem("seats");

             // ✅ Loyalty Points API Call
             this.loginService.addLoyalPoint(this.user.userId,seatIds).subscribe(
               res => {
                 this.toastService.showSuccess(res.message);
                 this.updateUserInfo();
               },
               err => {
                 console.error("Failed to add loyalty points", err);
                 this.toastService.showError("Loyalty points update failed.");
                 this.updateUserInfo();
               }
             );


             this.addNotification();
             this.showBookingConfirmation();
           },
           err => {
             this.toastService.showError("Booking confirmation failed.");
             console.error(err);
           }
         );
       },
       prefill: {
         name: `${this.user.firstName} ${this.user.lastName}`,
         email: this.user.email,
         contact: ''
       },
       theme: {
         color: '#3399cc'
       }
     };

     const rzp = new Razorpay(options);
     rzp.on('payment.failed', (response: any) => {
       console.error('Payment failed:', response.error);
       this.toastService.showError("Payment failed. Please try again.");
     });

     rzp.open();
   }

   updateUserInfo(): void {
     this.loginService.validateCredentials(this.user.email, this.user.passwordHash).subscribe(
       res => sessionStorage.setItem("user", JSON.stringify(res)),
       err => console.log(err)
     );
   }

   showBookingConfirmation(): void {
     this.modalInstance?.show();
     setTimeout(() => {
       this.modalInstance?.hide();
       this.router.navigate(['/viewBooking']);
     }, 5000);
   }

   addNotification(): void {
     const startTime = new Date(this.showtime.start_time);
     const now = new Date();
     const diffHrs = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
     const notifications: Notification[] = [];

     notifications.push({
       userId: this.user.userId,
       user: null,
       isRead: 0,
       message: `Booking confirmed for ${this.showtime.title}`,
       notificationType: "Booking",
       displayTime: new Date()
     });

     if (diffHrs >= 24) {
       notifications.push(
         { userId: this.user.userId, user: null, isRead: 0, message: "Your movie is tomorrow at " + startTime.toLocaleTimeString(), notificationType: "Reminder", displayTime: new Date(startTime.getTime() - 24 * 60 * 60 * 1000) },
         { userId: this.user.userId, user: null, isRead: 0, message: "Your movie starts in 4 hours!", notificationType: "Reminder", displayTime: new Date(startTime.getTime() - 4 * 60 * 60 * 1000) },
         { userId: this.user.userId, user: null, isRead: 0, message: "Your movie starts in 1 hour!", notificationType: "Reminder", displayTime: new Date(startTime.getTime() - 1 * 60 * 60 * 1000) }
       );
     } else if (diffHrs >= 4) {
       notifications.push(
         { userId: this.user.userId, user: null, isRead: 0, message: "Your movie starts in 4 hours!", notificationType: "Reminder", displayTime: new Date(startTime.getTime() - 4 * 60 * 60 * 1000) },
         { userId: this.user.userId, user: null, isRead: 0, message: "Your movie starts in 1 hour!", notificationType: "Reminder", displayTime: new Date(startTime.getTime() - 1 * 60 * 60 * 1000) }
       );
     } else if (diffHrs >= 1) {
       notifications.push({
         userId: this.user.userId,
         user: null,
         isRead: 0,
         message: "Your movie starts in 1 hour!",
         notificationType: "Reminder",
         displayTime: new Date(startTime.getTime() - 1 * 60 * 60 * 1000)
       });
     }

     let addedCount = 0;
     notifications.forEach(notification => {
       this.notification.addnotifications(notification).subscribe(
         res => { },
         err => {
           this.toastService.showError("Notification error");
           console.log(err);
         },
         () => {
           addedCount++;
           if (addedCount === notifications.length) {
             setTimeout(() => {
               this.notificationService.fetchNotifications(this.user.userId);
             }, 500);
           }
         }
       );
     });
   }

   onTickClick(): void {
     this.modalInstance?.hide();
     this.router.navigate(['/viewBooking']);
   }

   goBack(): void {
     this.router.navigate(['seatmap', this.showtimeId]);
   }
 }
