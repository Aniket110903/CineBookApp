export interface BookedSeat {
  bookingId: number;
  seatId: number;
  price?: number;
  rowLabel?: string;
  seatNumber?: string;
}
