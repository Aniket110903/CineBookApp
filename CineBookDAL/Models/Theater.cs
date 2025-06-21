
using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Theater
{
    public int TheaterId { get; set; }

    public string? Name { get; set; }

    public string? Location { get; set; }
    public decimal? status { get; set; }
    public string? Address { get; set; }

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();

}