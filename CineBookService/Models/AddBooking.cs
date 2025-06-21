namespace CineBookServices.Model
{
    public class AddBooking
    {
        public int UserId { get; set; }
        public int ShowtimeId { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = "Pending";
        public List<Seats> Seats { get; set; } = new List<Seats>();
    }
}