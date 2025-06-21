using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class BookedSeat
{
    public int BookingId { get; set; }

    public int SeatId { get; set; }
    public decimal? Price { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Seat Seat { get; set; } = null!;
}