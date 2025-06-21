using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using CineBookServices.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.Extensions.Configuration;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class BookingController : Controller
    {

        private readonly CineBookRepository _repository;
        private readonly BookingService _bookingService;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;
        public BookingController(IConfiguration configuration, CineBookRepository repository, BookingService bookingService, EmailService emailService)
        {
            _repository = repository;
            _bookingService = bookingService;
            _emailService = emailService;

        }

        #region AddBooking
        [HttpPost()]
        public async Task<IActionResult> CreateBooking([FromBody] AddBooking addBooking)
        {
            try
            {
                var razorpayOrderId = await _bookingService.CreateBookingAsync(addBooking);
                var bookingId = _bookingService.GetLatestBookingIdForUser(addBooking.UserId); // Or use the return value

                return Ok(new { razorpayOrderId, bookingId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        #endregion
        // Optional: Confirm booking endpoint called after payment success webhook or client notification
        [HttpPost]
        public IActionResult ConfirmBooking([FromBody] ConfirmBookingRequest request)
        {
            try
            {
                _bookingService.ConfirmBooking(request.BookingId, request.SeatIds);
                Payment payment = new Payment();
                payment.PaymentStatus = request.PaymentStatus;
                payment.RazorpayOrderId = request.RazorpayOrderId;
                payment.RazorpaySignature = request.RazorpaySignature;
                payment.BookingId = request.BookingId;
                payment.RazorpayPaymentId = request.RazorpayPaymentId;
                payment.PaymentMode = "Card";
                payment.consume_loyaltypoint = request.UseLoyaltyPoints ? 1 : 0;
                Booking booking = _repository.GetBookingById(request.BookingId);  // Make sure this method exists
                payment.Amount = booking.TotalAmount;
                this._repository.AddPayment(payment);
                bool loyaltyUsed = request.UseLoyaltyPoints ? _repository.LoyaltyPoint(request.UserId, request.UseLoyaltyPoints) : false;
                if (booking != null)
                {
                    var toEmail = booking.User?.Email;  // Or wherever the email is stored
                    if (!string.IsNullOrEmpty(toEmail))
                    {
                        // Fire and forget email sending so ConfirmBooking doesn't wait on it
                        Task.Run(() => _emailService.SendBookingConfirmationEmailAsync(toEmail, booking));
                    }
                }

                return Ok(new { Message = "Booking confirmed successfully" });


            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        #region  GetAllBookings
        [HttpGet]
        public JsonResult GetAllBookings()
        {


            List<Booking> bookings = new List<Booking>();
            try
            {
                bookings = _repository.GetAllBookings();
            }
            catch (Exception)
            {

                bookings = null;
            }
            return Json(bookings);

        }
        #endregion
        #region Cancel Booking
        [HttpDelete]
        public JsonResult CancelBooking(int bookingId)
        {
            try
            {
                bool result = _repository.CancelBooking(bookingId);

                if (result)
                    return Json("Booking cancelled successfully.");
                else
                    return Json("Booking not found or already cancelled.");
            }
            catch (Exception ex)
            {
                return Json("Error occurred: " + ex.Message);
            }
        }

        #endregion




    }
}