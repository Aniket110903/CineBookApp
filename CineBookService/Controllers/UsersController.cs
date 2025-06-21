using Azure;
using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using CineBookServices.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsersController : Controller
    {
        CineBookRepository repository;
        private readonly IConfiguration _configuration;

        private readonly EmailService _emailService;
        public UsersController(CineBookRepository repository, EmailService emailService)
        {
            this.repository = repository;
            _emailService = emailService;
        }

        #region loginUser
        [HttpPost]
        public JsonResult LoginUser(Users user)
        {
            User resp = new User();

            try
            {
                resp = repository.LoginUser(user.Email, user.Password);
            }
            catch (Exception)
            {
                resp = null;
            }
            return Json(resp);
        }
        #endregion

        #region Register

        [HttpPost]
        public JsonResult Register(Users request)
        {
            User register = new User();
            string status = "";


            try
            {
                register.FirstName = request.FirstName;
                register.LastName = request.LastName;
                register.Email = request.Email;
                register.PasswordHash = request.Password;
                register.Address = request.Address;
                register.Role = request.Role;

                bool x = repository.RegisterUser(register);

                if (x)
                {
                    // ✅ Get back the same user to read the generated reset code
                    var savedUser = repository.LoginUser(register.Email, register.PasswordHash);
                    //var emailService = new EmailService(_configuration);
                    Task.Run(async () => {
                        try
                        {
                            await _emailService.SendResetCodeEmailAsync(savedUser.Email, savedUser.ResetCode);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("Email sending failed: " + ex.Message);
                        }
                    });



                    status = "Registration successful. Your reset code is: " + savedUser.ResetCode;
                }
                else
                {
                    status = "Try again later.";
                }
            }
            catch (Exception ex)
            {
                status = "Some error occurred! Error: ";
            }

            return Json(status);
        }
        #endregion


        [HttpPost]
        public JsonResult VerifyResetCode([FromBody] ResetCodeRequest request)
        {
            var user = repository.VerifyResetCode(request.Email, request.ResetCode);
            if (user != null)
            {
                return Json(new { success = true, message = "Verification successful", userId = user.UserId });
            }
            else
            {
                return Json(new { success = false, message = "Invalid email or reset code" });
            }
        }
        [HttpPost]
        public JsonResult ResetPassword([FromBody] Model.ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return Json(new { success = false, message = "New password and confirm password do not match." });
            }

            var status = repository.ResetUserPassword(request.Email, request.NewPassword);
            if (status)
            {
                return Json(new { success = true, message = "Password reset successful." });
            }
            else
            {
                return Json(new { success = false, message = "Password reset failed. Please check your email and try again." });
            }
        }

        [HttpGet]
        public JsonResult BookingHistory(int userId)
        {
            try
            {

                var bookings = repository.GetBookingHistoryByUserId(userId);

                if (bookings == null || bookings.Count == 0)
                {
                    return Json(new { success = false, message = "No booking history found." });
                }


                var bookingHistory = bookings.Select(b => new
                {
                    b.BookingId,
                    b.BookingStatus,
                    b.BookingTime,
                    b.TotalAmount,
                    Showtime = new
                    {
                        b.Showtime?.ShowtimeId,
                        MovieTitle = b.Showtime?.Movie?.Title,
                        TheaterName = b.Showtime?.Theater?.Name,
                        TheaterLoc = b.Showtime?.Theater?.Location,
                        TheaterAdd = b.Showtime?.Theater?.Address,
                        b.Showtime?.StartTime,
                        b.Showtime?.EndTime
                    },
                    Seats = b.BookedSeats.Select(bs => new
                    {
                        SeatNumber = bs.Seat.SeatNumber,
                        RowLabel = bs.Seat.RowLabel,
                        bs.Price
                    }).ToList(),
                    Payments = b.Payments.Select(p => new
                    {
                        p.PaymentId,
                        p.Amount,
                        PaymentTime = p.PaymentTime
                    }).ToList()
                }).ToList();

                return Json(new { success = true, data = bookingHistory });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error fetching booking history", error = ex.Message });
            }
        }


        #region updateProfile
        [HttpPut]
        public JsonResult UpdateProfile(UpdateProfile updateprofile)
        {

            string status = "";
            try
            {

                bool resp = false;
                User loginres = this.repository.LoginUser(updateprofile.Email, updateprofile.Password);
                if (loginres != null)
                {
                    loginres.FirstName = updateprofile.FirstName;
                    loginres.LastName = updateprofile.LastName;
                    loginres.Email = updateprofile.newEmail;
                    loginres.Address = updateprofile.Address;
                    resp = this.repository.UpdateProfile(loginres);
                    status = "successfully updated";
                }
                else
                {
                    status = "Password is Incorrect";
                }

            }
            catch (Exception e)
            {
                status = null;
            }
            return Json(status);


        }
        #endregion
        [HttpPut]
        public IActionResult AddLoyalPoint(ConfirmBookingRequest request)
        {
            // ideally use DI
            var result = repository.BookSeatsAndAddLoyaltyPoints(request.UserId, request.SeatIds);

            if (result != 0)
                return Ok(new { success = true, message = "Congrats you have earned " + result + " loyalty points" });

            return BadRequest(new { success = false, message = "Something Bad happned" });
        }

    }
}