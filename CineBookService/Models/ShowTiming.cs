

namespace CineBookServices.Model
{
    public class ShowTiming
    {

        public int ShowtimeId { get; set; }

        public int? MovieId { get; set; }

        public int? TheaterId { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public decimal? status { get; set; }


    }
}