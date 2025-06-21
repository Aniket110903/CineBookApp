using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineBookDataAccessLayer.Models
{
    public class PaymentInfo
    {
        public string PaymentMode { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime PaymentTime { get; set; }
    }
}