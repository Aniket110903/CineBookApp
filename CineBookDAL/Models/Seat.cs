using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int? TheaterId { get; set; }
    public int? ShowtimeId { get; set; }

    public string? SeatNumber { get; set; }

    public string? RowLabel { get; set; }

    public double? Price { get; set; }

    public decimal? IsOccupied { get; set; }

    public virtual ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();

    public virtual Theater? Theater { get; set; }
}