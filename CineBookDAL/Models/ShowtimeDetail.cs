using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CineBookDataAccessLayer.Models
{
    public class ShowtimeDetail
    {
        [Key]
        public int showtime_id { get; set; }
        public int movie_id { get; set; }
        public string title { get; set; } = null!;
        public int theater_id { get; set; }
        public string theater_name { get; set; } = null!;
        public string address { get; set; } = null!;
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
    }
}