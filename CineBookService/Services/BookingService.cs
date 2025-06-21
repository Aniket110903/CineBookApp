using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using CineBookServices.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace CineBookServices.Services
{
    public class BookingService
    {
        private readonly CineBookRepository _bookingDal;
        private readonly RazorpayService _razorpayService;

        public BookingService(CineBookRepository bookingDal, RazorpayService razorpayService)
        {
            _bookingDal = bookingDal;
            _razorpayService = razorpayService;
        }
        public async Task<string> CreateBookingAsync(AddBooking addBooking)
        {
            var seatIds = addBooking.Seats.Select(s => s.SeatId).ToList();

            // 1. Check if seats are available
            if (!_bookingDal.AreSeatsAvailable(seatIds, addBooking.ShowtimeId))
                throw new Exception("One or more seats are already booked.");

            // 2. Create booking record with status "Pending"
            var booking = new Booking
            {
                UserId = addBooking.UserId,
                ShowtimeId = addBooking.ShowtimeId,
                TotalAmount = addBooking.TotalAmount,
                BookingStatus = "Pending",
                BookingTime = DateTime.Now
            };
            _bookingDal.AddBooking(booking);

            // 3. Insert booked seats linked to booking
            var bookedSeats = addBooking.Seats.Select(seat => new BookedSeat
            {
                BookingId = booking.BookingId,
                SeatId = seat.SeatId,
                Price = (decimal)seat.Price
            }).ToList();

            _bookingDal.AddBookedSeats(bookedSeats);

            // 4. Create Razorpay order
            var razorpayOrderId = await _razorpayService.CreateOrder(addBooking.TotalAmount);

            // 5. Update booking with razorpay order id and keep status "Pending"
            //booking.RazorpayOrderId = razorpayOrderId;
            _bookingDal.UpdateBookingStatus(booking.BookingId, "Pending");

            return razorpayOrderId;
        }

        public void ConfirmBooking(int bookingId, List<int> seatIds)
        {
            // Mark seats occupied after payment success
            _bookingDal.MarkSeatsOccupied(seatIds);

            // Update booking status to confirmed
            _bookingDal.UpdateBookingStatus(bookingId, "Confirmed");
        }
        public int GetLatestBookingIdForUser(int userId)
        {
            return _bookingDal.GetLatestBookingIdForUser(userId);
        }

    }
}