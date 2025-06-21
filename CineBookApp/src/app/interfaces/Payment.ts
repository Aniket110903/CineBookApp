export interface Payment {
  paymentId: number;
  bookingId?: number;
  paymentMode?: string;
  amount?: number;
  paymentStatus?: string;
  paymentTime?: string;  // or Date
}
