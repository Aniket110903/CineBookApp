using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public double? Rating { get; set; }

    public string? PosterUrl { get; set; }
    public string? Genre { get; set; }

    public DateOnly? ReleaseDate { get; set; }
    public decimal? status { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}