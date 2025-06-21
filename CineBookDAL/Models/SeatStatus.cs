using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineBookDataAccessLayer.Models
{
    public class SeatStatus
    {
        public int SeatId { get; set; }
        public string SeatNumber { get; set; }
        public bool IsBooked { get; set; }
    }
}