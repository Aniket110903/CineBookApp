namespace CineBookServices.Model
{
    public class Movies
    {
        public int MovieId { get; set; }
        public string? Title { get; set; }

        public string? Description { get; set; }

        public string? PosterUrl { get; set; }
        public string? Genre { get; set; }

        public DateOnly? ReleaseDate { get; set; }

        public int Status { get; set; }

    }
}