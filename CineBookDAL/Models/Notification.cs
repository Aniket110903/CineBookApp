using System;
using System.Collections.Generic;

namespace CineBookDataAccessLayer.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? UserId { get; set; }

    public string? Message { get; set; }

    public string? NotificationType { get; set; }

    public DateTime? SentTime { get; set; }
    public DateTime? DisplayTime { get; set; }

    public virtual User? User { get; set; }

    public decimal? IsRead { get; set; }
}