namespace CineBookServices.Model
{
    public class Seats
    {
        public int SeatId { get; set; }

        public int? TheaterId { get; set; }
        public int? ShowtimeId { get; set; }

        public string? SeatNumber { get; set; }

        public string? RowLabel { get; set; }

        public double? Price { get; set; }

        public decimal? IsOccupied { get; set; }

    }
}