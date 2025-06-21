import { BookedSeat } from "./BookedSeat";
import { Payment } from "./Payment";
import { Showtime } from "./Showtime";

export interface Booking {
  BookingStatus: any;
  bookingId: number;
  userId?: number;  
  bookingTime: string;  
  //bookedSeats: BookedSeat[];
  payments: Payment[];
  showtime: Showtime;
  seats: {
    seatNumber: string;
    rowLabel: string;
    price: number;
  }[];
  bookingStatus?: string;
  totalAmount?: any; 
 
}
