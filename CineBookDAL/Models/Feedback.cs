using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int? UserId { get; set; }

    public int? MovieId { get; set; }

    public int? Rating { get; set; }

    public string? Comments { get; set; }

    public DateTime? SubmittedAt { get; set; }

    //public virtual Movie? Movie { get; set; }

    public virtual User? User { get; set; }
}
