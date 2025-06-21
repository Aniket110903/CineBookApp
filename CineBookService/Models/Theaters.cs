namespace CineBookServices.Model
{
    public partial class Theaters
    {
        public int TheaterId { get; set; }

        public string? Name { get; set; }

        public string? Location { get; set; }
        public int Status { get; set; }
        public string? Address { get; set; }
    }
}