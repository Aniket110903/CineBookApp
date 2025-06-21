import { Seat } from "./Seat";

export interface AddBooking {
  UserId: number;
  ShowtimeId: number;
  TotalAmount: number;
  BookingStatus: string;
  Seats: Seat[];
}
