
using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? UserId { get; set; }

    public int? ShowtimeId { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? BookingStatus { get; set; }

    public DateTime? BookingTime { get; set; }

    public virtual ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Showtime? Showtime { get; set; }

    public virtual User? User { get; set; }
}