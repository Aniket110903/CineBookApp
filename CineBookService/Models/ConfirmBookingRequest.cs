namespace CineBookServices.Model
{
    public class ConfirmBookingRequest
    {
        public int BookingId { get; set; }
        public System.Collections.Generic.List<int> SeatIds { get; set; }
        public int UserId { get; set; }
        public bool UseLoyaltyPoints { get; set; } = false;
        public string? RazorpayPaymentId { get; set; }

        public string? RazorpayOrderId { get; set; }

        public string? RazorpaySignature { get; set; }
        public string? PaymentStatus { get; set; }
    }
}