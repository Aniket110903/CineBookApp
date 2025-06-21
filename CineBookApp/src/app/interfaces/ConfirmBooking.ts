export interface ConfirmBooking {
  bookingId: number,
  SeatIds: number[];
  UserId: number;
  UseLoyaltyPoints: boolean;
  RazorpayPaymentId: string;
  RazorpayOrderId: string;
  RazorpaySignature: string;
  PaymentStatus: string;
}
