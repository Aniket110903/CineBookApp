namespace CineBookServices.Model
{
    public class UpdateProfile
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }
        public string Email { get; set; }
        public string newEmail { get; set; }
        public string Password { get; set; }
        public string? Address { get; set; }
    }
}