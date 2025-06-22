using CineBookDataAccessLayer.Models; // Make sure this points to your Booking model namespace
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Linq;
using System.Threading.Tasks;

namespace CineBookServices.Services
{
    public class EmailService
    {
        private readonly string _sendGridApiKey;
        private readonly string _fromEmail;
        private readonly SendgridSettings _settings;

        // Inject IConfiguration to access SendGrid API key from appsettings.json
        public EmailService(IOptions<SendgridSettings> settings)
        {
            _settings = settings.Value;
            _sendGridApiKey= _settings.ApiKey;
            _fromEmail= _settings.FromEmail;
            //_sendGridApiKey = configuration["SendGrid:ApiKey"];
            //_fromEmail = configuration["SendGrid:FromEmail"];
        }

        public async Task SendBookingConfirmationEmailAsync(string toEmail, Booking booking)
        {
            Console.WriteLine($"Sending email to: {toEmail}");
            var client = new SendGridClient(_sendGridApiKey);
            var from = new EmailAddress(_fromEmail, "CineBook");
            var to = new EmailAddress(toEmail);
            var subject = $"Booking Confirmation - {booking.Showtime.Movie.Title}";

            var plainTextContent = GeneratePlainTextContent(booking);
            var htmlContent = GenerateHtmlContent(booking);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
        }

        private string GeneratePlainTextContent(Booking booking)
        {

            return
                $"Subject: Your CineBook Ticket for {booking.Showtime.Movie?.Title ?? "Unknown Movie"}\n\n" +
        $"Movie: {booking.Showtime.Movie?.Title ?? "Unknown"}\n" +
        $"Theater: {booking.Showtime.Theater?.Name ?? "Unknown Theater"}\n" +
        $"Date & Time: {booking.Showtime.StartTime}\n" +
        $"Tickets: {booking.BookedSeats?.Count ?? 0}\n" +
        $"Address: {booking.Showtime.Theater?.Address} {booking.Showtime.Theater?.Location}\n" +
        $"Seats: {string.Join(", ", booking.BookedSeats?.Select(s => $"Row {s.Seat?.RowLabel} Seat {s.Seat?.SeatNumber}") ?? new List<string> { "No seats" })}\n" +
        $"Booking ID: {booking.BookingId}\n" +
        $"Thank you for booking with CineBook!";
        }
        public async Task SendResetCodeEmailAsync(string toEmail, string resetCode)
        {
            Console.WriteLine($"Sending reset code to: {toEmail}");

            var client = new SendGridClient(_sendGridApiKey);
            var from = new EmailAddress(_fromEmail, "CineBook");
            var to = new EmailAddress(toEmail);
            var subject = "Welcome to CineBook - Your Reset Code";

            var plainTextContent = $"Thank you for registering with CineBook!\n\nYour reset code is: {resetCode}\n\nKeep this code safe for future password changes.";
            var htmlContent = $"<p>Thank you for registering with <strong>CineBook</strong>!</p><p>Your reset code is: <strong>{resetCode}</strong></p><p>Keep this code safe for future password updates.</p>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
        }
        private string GenerateHtmlContent(Booking booking)
        {
            return
         $"<h1>Booking Confirmation</h1>" +
         $"<p><strong>Movie:</strong> {booking.Showtime.Movie?.Title ?? "Unknown Movie"}</p>" +
         $"<p><strong>Theater:</strong> {booking.Showtime.Theater?.Name ?? "Unknown Theater"}</p>" +
         $"<p><strong>Date & Time:</strong> {booking.Showtime.StartTime}</p>" +
         $"<p><strong>Tickets:</strong> {booking.BookedSeats?.Count ?? 0}</p>" +
         $"<p><strong>Address:</strong> {booking.Showtime.Theater?.Address} {booking.Showtime.Theater?.Location}</p>" +
         $"<p><strong>Seats:</strong> {string.Join(", ", booking.BookedSeats?.Select(s => $"Row {s.Seat?.RowLabel} Seat {s.Seat?.SeatNumber}") ?? new List<string> { "No seats" })}</p>" +
         $"<p><strong>Booking ID:</strong> {booking.BookingId}</p>" +
         $"<p>Thank you for booking with CineBook!</p>";
        }
    }
}