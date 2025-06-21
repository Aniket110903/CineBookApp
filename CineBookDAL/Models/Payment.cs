using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int? BookingId { get; set; }

    public string? RazorpayPaymentId { get; set; }

    public string? RazorpayOrderId { get; set; }

    public string? RazorpaySignature { get; set; }

    public string? PaymentMode { get; set; }  // e.g., card, upi

    public decimal? Amount { get; set; }

    public string? Currency { get; set; } = "INR";

    public string? PaymentStatus { get; set; }  // e.g., captured, failed

    public DateTime? PaymentTime { get; set; }

    public decimal? consume_loyaltypoint { get; set; }  // 0 or 1

    public virtual Booking? Booking { get; set; }
}