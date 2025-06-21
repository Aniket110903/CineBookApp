using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineBookDataAccessLayer.Models
{
    public class BookingHistory
    {
        public int BookingId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string TheaterName { get; set; } = string.Empty;
        public string TheaterLocation { get; set; } = string.Empty;
        public DateTime ShowtimeStart { get; set; }
        public DateTime ShowtimeEnd { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public List<string> SeatsBooked { get; set; } = new List<string>();
        public List<PaymentInfo> Payments { get; set; } = new List<PaymentInfo>();
    }
}