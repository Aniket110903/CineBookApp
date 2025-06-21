using Azure;
using CineBookDataAccessLayer.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SendGrid.Helpers.Mail;
using System;
using System.Text.RegularExpressions;

namespace CineBookDataAccessLayer
{
    public class CineBookRepository
    {
        public CineBookDbContext Context { get; set; }

        #region CineBookRepository Constructor
        public CineBookRepository(CineBookDbContext context)
        {
            this.Context = context;
        }
        #endregion

        #region GetAllMovies
        public List<Movie> GetAllMovies()
        {
            List<Movie> movies = new List<Movie>();
            List<Movie> response = new List<Movie>();
            try
            {
                movies = Context.Movies.Where(m => m.status == 1).ToList();
                foreach (Movie movie in movies)
                {
                    List<Feedback> Fdlst = Context.Feedbacks.Where(f => f.MovieId == movie.MovieId).ToList();
                    List<Showtime> Shlst = Context.Showtimes.Where(f => f.MovieId == movie.MovieId).ToList();
                    movie.Feedbacks = Fdlst;
                    movie.Showtimes = Shlst;
                    response.Add(movie);
                }
            }
            catch (Exception)
            {
                response = null;
            }
            return response;

        }
        #endregion

        #region AddMovie
        public bool AddMovie(Movie movie)
        {
            bool status = false;
            try
            {
                using (var context = new CineBookDbContext())
                {
                    int noOfRowsAffected = 0;   
                    Context.Movies.Add(movie);
                    Context.SaveChanges();
                    SqlParameter message = new SqlParameter("@message", "New movie released:"+movie.Title);
                    SqlParameter notificationType = new SqlParameter("@notification_type", "New Movie");
                    noOfRowsAffected = context.Database.ExecuteSqlRaw("EXEC  AddNotificationToAllUsers @message,@notification_type", message,notificationType);
                }
                status = true;
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }

        #endregion

        #region UpdateMovie
        public bool UpdateMovie(Movie movies)
        {
            bool status = false;
            try
            {
                Movie movie = Context.Movies.Find(movies.MovieId);
                if (movie != null)
                {
                    movie.Title = movies.Title;
                    movie.Description = movies.Description;
                    movie.ReleaseDate = movies.ReleaseDate;
                    movie.PosterUrl = movies.PosterUrl;
                    movie.Genre = movies.Genre;
                    using (var context = new CineBookDbContext())
                    {
                        context.Movies.Update(movie);
                        context.SaveChanges();
                        status = true;
                    }
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }

        #endregion

        #region AddShowTime
        public bool AddShowTime(Showtime showtime)
        {
            bool showtimeStatus = false;
            bool status = false;
            int addSeatStatus = 0;
            int noOfRowsAffected = 0;


            SqlParameter result = new SqlParameter("@result", System.Data.SqlDbType.Int);
            result.Direction = System.Data.ParameterDirection.Output;
            try
            {
                using (var context = new CineBookDbContext())
                {
                    context.Showtimes.Add(showtime);
                    context.SaveChanges();
                    showtimeStatus = true;
                    SqlParameter theaterId = new SqlParameter("@theater_id", showtime.TheaterId);
                    SqlParameter showtimeId = new SqlParameter("@showtime_id", showtime.ShowtimeId);
                    noOfRowsAffected = context.Database.ExecuteSqlRaw("EXEC  InsertSeats @theater_id,@showtime_id, @result OUT", theaterId, showtimeId, result);
                    addSeatStatus = Convert.ToInt32(result.Value); ;
                    if (showtimeStatus && addSeatStatus == 1)
                    {
                        status = true;
                    }
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region UpdateShowTime
        public bool UpdateShowTime(Showtime showtime)
        {
            bool status = false;
            try
            {
                Showtime sh = Context.Showtimes.Find(showtime.ShowtimeId);
                if (sh != null)
                {
                    sh.StartTime = showtime.StartTime;
                    sh.EndTime = showtime.EndTime;
                    sh.TheaterId = showtime.TheaterId;
                    sh.MovieId = showtime.MovieId;
                    using (var context = new CineBookDbContext())
                    {
                        context.Showtimes.Update(sh);
                        context.SaveChanges();
                        status = true;
                    }
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region GetSeatStatusByShowTime
        public Dictionary<string, List<object>> GetSeatStatusByshowTime(int showtimeId)
        {
            try
            {
                var allSeats = Context.Seats.Where(x => x.ShowtimeId.HasValue && x.ShowtimeId.Value == showtimeId)
                    .Include(s => s.Theater).ToList();

                if (!allSeats.Any())
                {
                    Console.WriteLine($"No seats found for showtimeId={showtimeId}");
                    return new Dictionary<string, List<object>>();
                }
                var result = allSeats.Where(seat => seat.RowLabel != null).Select(seat => new
                {
                    seat.SeatId,
                    seat.SeatNumber,
                    RowLabel = seat.RowLabel,
                    seat.Price,
                    seat.Theater?.Location,
                    seat.Theater?.Address,
                    IsOccupies = seat.IsOccupied
                }).GroupBy(seat => seat.RowLabel).ToDictionary(
                    group => group.Key!,
                    group => group.Cast<Object>().ToList()
                    );
                Console.WriteLine($"Grouped seats for showtimrId{showtimeId}:{result.Count}row(s)");
                return result;
            }
            catch (Exception ex) {
                Console.WriteLine("error in method: " + ex.Message);
                return new Dictionary<string, List<object>>();
            }


        }

        #endregion

        #region ViewShowTiming
        public List<Theater> ViewShowTiming(DateOnly date, int movieId, string location)
        {
            List<Theater> theaters = Context.Theaters
                .Where(l => l.Location == location && l.status == 1)
                .ToList();

            List<Theater> response = new List<Theater>();

            try
            {
                foreach (Theater item in theaters)
                {
                    // Get all showtimes for this theater
                    List<Showtime> allShowtimes = Context.Showtimes
                        .Where(p => p.TheaterId == item.TheaterId && p.status == 1)
                        .ToList();

                    // Filter showtimes for this theater based on date and movie
                    List<Showtime> filteredShowtimes = allShowtimes
                        .Where(showtime =>
                        {
                            if (showtime.MovieId != movieId || showtime.StartTime == null)
                                return false;

                            DateTime showDate = ((DateTime)showtime.StartTime).Date;
                            DateTime inputDate = date.ToDateTime(TimeOnly.MinValue).Date;

                            return showDate == inputDate;
                        })
                        .ToList();

                    // Only add theater to response if it has valid showtimes
                    if (filteredShowtimes.Any())
                    {
                        Theater th = new Theater
                        {
                            Address = item.Address,
                            TheaterId = item.TheaterId,
                            Location = item.Location,
                            status = item.status,
                            Name = item.Name,
                            Seats = item.Seats,
                            Showtimes = filteredShowtimes
                        };

                        response.Add(th);
                    }
                }
            }
            catch (Exception)
            {
                response = null;
            }

            return response;
        }

        #endregion

        #region loginUser
        public User LoginUser(string email, string password)
        {
            User response = new User();
            try
            {
                using (var context = new CineBookDbContext())
                {
                    User user1 = context.Users.FirstOrDefault(u => u.Email == email);
                    if (user1 != null)
                    {
                        if (user1.PasswordHash == password)
                        {
                            response = user1;
                        }
                        else
                        {
                            response = null;
                        }

                    }
                }
            }
            catch (Exception)
            {
                response = null;
            }
            return response;

        }
        #endregion

        #region RegisterUser
        public bool RegisterUser(User model)
        {
            bool status = false;
            try
            {
                using (var context = new CineBookDbContext())
                {
                    model.ResetCode = GenerateResetCode(); // ✅ Add reset code
                    context.Users.Add(model);
                    context.SaveChanges();
                    status = true;
                }
            }
            catch (Exception ex)

            {
                Console.WriteLine(ex);
                status = false;
            }
            return status;
        }

        //  Helper to generate 10-char Unicode reset code
        public string GenerateResetCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            return new string(Enumerable.Repeat(chars, 4)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public User VerifyResetCode(string email, string resetCode)
        {
            try
            {
                using (var context = new CineBookDbContext())
                {
                    User user = context.Users.FirstOrDefault(u => u.Email == email && u.ResetCode == resetCode);
                    return user; // will be null if not found
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        public bool ResetUserPassword(string email, string newPassword)
        {
            try
            {
                // Fetch user by email
                var user = Context.Users.SingleOrDefault(u => u.Email == email);

                if (user == null)
                    return false; // User not found

                // Update the password hash (or password field, depending on your design)
                user.PasswordHash = newPassword;  // You should hash the password here in real apps!

                // Save changes
                Context.SaveChanges();

                return true;
            }
            catch (Exception)
            {
                // Optionally log the exception
                return false;
            }
        }


        #endregion

        #region AddRating
        public bool AddRating(Feedback Rating)
        {
            bool status = false;
            try
            {
                using (var context = new CineBookDbContext())
                {
                    context.Feedbacks.Add(Rating);
                    context.SaveChanges();
                    status = true;
                    var allRatings = context.Feedbacks.Where(f => f.MovieId == Rating.MovieId).Select(f => f.Rating).ToList();
                    if (allRatings.Any())
                    {
                        double avgRating = (double)allRatings.Average();
                        var movie = context.Movies.FirstOrDefault(m => m.MovieId == Rating.MovieId);
                        if (movie != null)
                        {
                            movie.Rating = avgRating;
                            context.SaveChanges();
                        }
                    }
                    status = true;
                }


            }
            catch (Exception)
            {
                status = false;

            }
            return status;
        }
        #endregion

        #region AddTheaters
        public bool AddTheaters(Theater theater)
        {
            bool status = false;
            try
            {
                using (var context = new CineBookDbContext())
                {

                    context.Theaters.Add(theater);
                    context.SaveChanges();
                    status = true;
                }
            }
            catch (Exception)
            {

                status = false;
            }
            return status;
        }
        #endregion

        #region GetShowTimming
        public List<Showtime> GetShowTiming()
        {
            List<Showtime> response = new List<Showtime>();
            try
            {
                response = Context.Showtimes.Where(s => s.status == 1).ToList();
            }
            catch (Exception)
            {
                response = null;
            }
            return response;
        }
        #endregion
        public List<Booking> GetBookingHistoryByUserId(int userId)
        {
            try
            {
                var bookings = Context.Bookings
                    .Where(b => b.UserId == userId)
                    .Include(b => b.BookedSeats)
                        .ThenInclude(bs => bs.Seat)
                    .Include(b => b.Payments)
                    .Include(b => b.Showtime)
                        .ThenInclude(st => st.Movie)
                    .Include(b => b.Showtime)
                        .ThenInclude(st => st.Theater)
                    .OrderByDescending(b => b.BookingTime)
                    .ToList();

                return bookings;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in GetBookingHistory: " + ex.Message);
                return null;
            }
        }
        public Booking GetBookingById(int bookingId)
        {
            return Context.Bookings
                .Include(b => b.Showtime)
                    .ThenInclude(st => st.Movie)
                .Include(b => b.Showtime)
                    .ThenInclude(st => st.Theater)
                .Include(b => b.BookedSeats)
                    .ThenInclude(bs => bs.Seat)
                .Include(b => b.User)
                .FirstOrDefault(b => b.BookingId == bookingId);
        }


        #region GetAllTheater
        public List<Theater> GetAllTheater()
        {
            List<Theater> lst = new List<Theater>();
            try
            {
                lst = this.Context.Theaters.Where(t => t.status == 1).ToList();
            }
            catch (Exception)
            {
                lst = null;
            }
            return lst;
        }
        #endregion

        #region getMovieDetails
        public Movie GetMovieDetails(int movieId)
        {
            Movie movie = new Movie();
            try
            {
                movie = Context.Movies.FirstOrDefault(m => m.MovieId == movieId);
                movie.Feedbacks = this.getFeedback(movieId);

            }
            catch (Exception ex)
            {
                Console.WriteLine("error fetching movie details" + ex.Message);
            }
            return movie;
        }
        #endregion




        #region DeleteShowTime
        public bool DeleteShowTime(string showTime)
        {
            bool status = false;
            try
            {
                Showtime sh = Context.Showtimes.Find(Convert.ToInt32(showTime));
                if (sh != null)
                {
                    sh.status = 0;
                    Context.Showtimes.Update(sh);
                    Context.SaveChanges();
                    status = true;
                }

            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region DeleteAllPreviousShow
        public bool? DeleteAllPreviousShow()
        {
            bool? status = false;
            DateTime now = DateTime.Now;
            try
            {
                List<Showtime> lst = Context.Showtimes.Where(s => s.EndTime < now).ToList();
                if (lst.Count > 0)
                {
                    foreach (Showtime s in lst)
                    {
                        s.status = 0;
                    }
                    Context.Showtimes.UpdateRange(lst);
                    Context.SaveChanges();
                    status = true;
                }
                else
                {
                    status = null;
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region DeleteMovie
        public bool DeleteMovie(string movieId)
        {
            bool status = false;
            try
            {
                Movie mov = this.Context.Movies.Find(Convert.ToInt32(movieId));
                if (mov != null)
                {
                    List<Showtime> lst = Context.Showtimes.Where(s => s.MovieId == Convert.ToInt32(movieId)).ToList();
                    if (lst.Count > 0)
                    {
                        foreach (Showtime s in lst)
                        {
                            s.status = 0;
                        }
                        Context.Showtimes.UpdateRange(lst);
                        Context.SaveChanges();
                    }
                    mov.status = 0;
                    Context.Movies.Update(mov);
                    Context.SaveChanges();
                    status = true;
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region UpdateProfile
        public bool UpdateProfile(User user)
        {
            bool status = false;
            try
            {
                //var User = Context.Users.FirstOrDefault(u => u.Email == user.Email);
                if (user != null)
                {

                    Context.Users.Update(user);
                    Context.SaveChanges();
                    status = true;

                }


            }
            catch (Exception ex)
            {
                throw;
            }
            return status;
        }
        #endregion

        #region Update Theater
        public bool updateTheater(Theater theater)
        {
            bool status = false;
            try
            {
                Theater t = Context.Theaters.Find(theater.TheaterId);
                if (t != null)
                {
                    t.Name = theater.Name;
                    t.Location = theater.Location;
                    t.status = theater.status;
                    t.Address = theater.Address;
                    using (var context = new CineBookDbContext())
                    {
                        context.Theaters.Update(t);
                        context.SaveChanges();
                        status = true;
                    }
                }
            }
            catch (Exception)
            {

                status = false;
            }
            return status;
        }
        #endregion

        #region Delete Theater
        public bool deleteTheater(int id)
        {
            bool status = false;
            try
            {
                Theater t = Context.Theaters.Find(id);
                if (t != null)
                {
                    t.status = 0;
                    using (var context = new CineBookDbContext())
                    {
                        context.Theaters.Update(t);
                        context.SaveChanges();
                        status = true;
                    }
                }
            }
            catch (Exception)
            {

                status = false;
            }
            return status;
        }

        #endregion

        #region  get feedback by id 
        public List<Feedback> getFeedback(int movieId)
        {
            List<Feedback> fb = new List<Feedback>();
            try
            {
                fb = Context.Feedbacks.Where(i => i.MovieId == movieId).ToList();
                foreach (Feedback item in fb)
                {
                    item.User = Context.Users.Find(item.UserId);
                }
            }
            catch (Exception)
            {

                fb = null;
            }
            return fb;
        }
        #endregion

        #region ShowTimeDetials
        public ShowtimeDetail getShowtimeDetails(int ShowtimeId)
        {
            ShowtimeDetail sh = new ShowtimeDetail();
            try
            {
                SqlParameter showtime = new SqlParameter("@ShowtimeId", ShowtimeId);
                sh = Context.ShowtimeDetails.FromSqlRaw("SELECT * FROM GetShowtimeDetails(@ShowtimeId)", showtime).FirstOrDefault();
            }
            catch (Exception)
            {
                sh = null;
            }
            return sh;
        }
        #endregion


        #region DeleteBooking
        public bool DeleteBooking(int bookingId)
        {
            bool status = false;
            try
            {
                Booking bk = Context.Bookings.Find(bookingId);
                Context.Bookings.Remove(bk);
                Context.SaveChanges();
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region UpdateSeatStatus
        public bool UpdateSeatStatus(List<Seat> seatList)
        {
            bool status = false;
            try
            {
                List<Seat> stl = new List<Seat>();
                foreach (Seat st in seatList)
                {
                    Seat s = Context.Seats.Find(st.SeatId);
                    s.IsOccupied = 1;
                    stl.Add(s);
                }
                Context.Seats.UpdateRange(stl);
                Context.SaveChanges();
                status = true;
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion


        #region  get All feedbacks 
        public List<Feedback> getAllFeedbacks()
        {
            List<Feedback> fb = new List<Feedback>();
            try
            {
                fb = Context.Feedbacks.ToList();
                foreach (Feedback item in fb)
                {
                    item.User = Context.Users.Find(item.UserId);

                }
            }
            catch (Exception)
            {

                fb = null;
            }
            return fb;
        }
        #endregion

        #region  delete feedbacks 
        public bool DeleteFeedbacks(int feedbackId)
        {
            try
            {
                // Fetch the feedback
                var feedback = Context.Feedbacks.Find(feedbackId);
                if (feedback == null)
                    return false;

                int? movieId = feedback.MovieId;

                // Remove the feedback
                Context.Feedbacks.Remove(feedback);
                Context.SaveChanges();

                // Recalculate average rating for the movie
                var remainingRatings = Context.Feedbacks
                    .Where(f => f.MovieId == movieId)
                    .Select(f => f.Rating)
                    .ToList();

                double newAverage = remainingRatings.Any() ? (double)remainingRatings.Average() : 0;

                var movie = Context.Movies.FirstOrDefault(m => m.MovieId == movieId);
                if (movie != null)
                {
                    movie.Rating = newAverage;
                    Context.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {
                // Log the exception (replace with your logger if available)
                Console.WriteLine($"Error deleting feedback: {ex.Message}");
                return false;
            }
        }

        #endregion

        #region Booking Methods
        public bool AreSeatsAvailable(List<int> seatIds, int showtimeId)
        {
            var occupiedSeats = Context.Seats
                .Where(s => seatIds.Contains(s.SeatId) && s.ShowtimeId == showtimeId && s.IsOccupied == 1)
                .ToList();

            return !occupiedSeats.Any();
        }
        public Booking AddBooking(Booking booking)
        {
            Context.Bookings.Add(booking);
            Context.SaveChanges();
            return booking;
        }

        public void AddBookedSeats(List<BookedSeat> bookedSeats)
        {
            Context.BookedSeats.AddRange(bookedSeats);
            Context.SaveChanges();
        }

        public void UpdateBookingStatus(int bookingId, string status)
        {
            var booking = Context.Bookings.Find(bookingId);
            if (booking != null)
            {
                booking.BookingStatus = status;
                Context.SaveChanges();
            }
        }

        public void MarkSeatsOccupied(List<int> seatIds)
        {
            var seats = Context.Seats.Where(s => seatIds.Contains(s.SeatId)).ToList();
            foreach (var seat in seats)
                seat.IsOccupied = 1;
            Context.SaveChanges();
        }
        public int GetLatestBookingIdForUser(int userId)
        {
            return Context.Bookings
                           .Where(b => b.UserId == userId)
                           .OrderByDescending(b => b.BookingTime)
                           .Select(b => b.BookingId)
                           .FirstOrDefault();
        }
        public void AddPayment(Payment payment)
        {
            Context.Payments.Add(payment);
            Context.SaveChanges();
        }

        #endregion
        #region Cancel Booking
        public bool CancelBooking(int bookingId)
        {
            try
            {
                using (var context = new CineBookDbContext())
                {
                    // 1. Load the booking with related booked seats
                    var booking = context.Bookings
                        .Include(b => b.BookedSeats)
                        .FirstOrDefault(b => b.BookingId == bookingId && b.BookingStatus.ToLower() != "cancelled" && b.BookingStatus.ToLower() !="pending");

                    // 2. Check if booking exists and is not cancelled
                    if (booking == null)
                        return false;
                    List<int> seatIds = booking.BookedSeats.Select(seat => seat.SeatId).ToList();
                    var seatsToUpdate = context.Seats.Where(s => seatIds.Contains(s.SeatId)).ToList();

                    // Mark each seat as not occupied
                    foreach (var seat in seatsToUpdate)
                    {
                        seat.IsOccupied = 0; // or 0 if it's an int
                    }

                    // Save changes to the database
                    // 3. Remove each booked seat
                    //if (booking.BookedSeats != null && booking.BookedSeats.Any())
                    //{
                    //    context.BookedSeats.RemoveRange(booking.BookedSeats);
                    //}

                    // 4. OPTIONAL: Clear any seat number list (if you store them as comma-separated string or similar)
                    // or "" based on your schema

                    // 5. Change the booking status
                    booking.BookingStatus = "Cancelled";

                    // 6. Save all changes
                    context.SaveChanges();

                    return true;
                }
            }
            catch (Exception ex)
            {
                // Optionally log ex.Message
                return false;
            }
        }


        #endregion

        #region  GetAllBookings
        public List<Booking> GetAllBookings()
        {
            return Context.Bookings.ToList();
        }
        #endregion



        public List<Notification> GetNotifications(int userId)
        {
            List<Notification> res = new List<Notification>();
            try
            {
                res = Context.Notifications.Where(x => x.UserId == userId).ToList();
            }
            catch (Exception)
            {
                res = null;
            }
            return res;
        }

        #region MarkasRead
        public bool markAsRead(int notificationId)
        {
            bool status = false;
            try
            {
                Notification notification = Context.Notifications.Find(notificationId);
                if (notification != null)
                {
                    notification.IsRead = 1;
                    this.Context.Update(notification);
                    this.Context.SaveChanges();
                    status = true;
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region MarkAllAsRead
        public bool markAllAsRead(int userId)
        {
            bool status = false;
            try
            {
                List<Notification> notification = Context.Notifications.Where(x=>x.UserId==userId).ToList();
                if (notification.Count>0)
                {
                    notification.ForEach(x => x.IsRead = 1);
                    this.Context.UpdateRange(notification);
                    this.Context.SaveChanges();
                    status = true;
                }
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion

        #region AddNotification
        public bool AddNotification(Notification not)
        {
            bool status = false;
            try
            {
                Context.Notifications.Add(not);
                Context.SaveChanges();
                status = true;
            }
            catch (Exception)
            {
                status = false;
            }
            return status;
        }
        #endregion
        #region loyaltypoint
        public bool LoyaltyPoint(int userId, bool useLoyalty)
        {
            bool status = false;
            try
            {
                using (var context = new CineBookDbContext())
                {
                    var user = context.Users.FirstOrDefault(u => u.UserId == userId);
                    if (user != null)
                    {
                            user.LoyaltyPoints= 0;
                            context.Users.Update(user);
                            context.SaveChanges();
                            status = true; 
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                status = false;
            }

            return status;
        }
        #endregion
        #region Add LoyalPoint
        public int BookSeatsAndAddLoyaltyPoints(int userId,List<int>SeatsId)
        {
            int success = 0;

            try
            {
                using (var context = new CineBookDbContext())
                {
                    var user = context.Users.FirstOrDefault(u => u.UserId == userId);
                    if (user == null) return 0;

                    int totalPoints = 0;

                    foreach (int seatId in SeatsId)
                    {
                        Seat seat = context.Seats.FirstOrDefault(s => s.SeatId == seatId);

                        string row = seat.RowLabel?.ToUpper();

                        if (row != null)
                        {
                            if ("A,B,C,D,E,F,G".Contains(row))
                                totalPoints += 10;
                            else if ("H,I,J,K".Contains(row))
                                totalPoints += 20;
                            else if ("L,M".Contains(row))
                                totalPoints += 30;
                        }
                    }
                    user.LoyaltyPoints += totalPoints;
                    context.Users.Update(user);

                    context.SaveChanges();
                    success = totalPoints;
                }
            }
            catch (Exception ex)
            {
                // Optionally log the exception
                success = 0;
            }

            return success;
        }
        #endregion
    }



}
