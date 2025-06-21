namespace CineBookServices.Model
{
    public class ResetCodeRequest
    {
        public string Email { get; set; }
        public string ResetCode { get; set; }
    }
}