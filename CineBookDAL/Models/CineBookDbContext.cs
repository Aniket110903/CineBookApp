using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using CineBookDataAccessLayer.Models;
namespace CineBookDataAccessLayer.Models;

public partial class CineBookDbContext : DbContext
{
    public CineBookDbContext()
    {
    }

    public CineBookDbContext(DbContextOptions<CineBookDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BookedSeat> BookedSeats { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<Showtime> Showtimes { get; set; }

    public virtual DbSet<Theater> Theaters { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public DbSet<ShowtimeDetail> ShowtimeDetails { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=db22009.public.databaseasp.net; Database=db22009; User Id=db22009; Password=jR=27mC?S8%h; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BookedSeat>(entity =>
        {
            entity.HasKey(e => new { e.BookingId, e.SeatId }).HasName("PK__Booked_S__84E57B68ABB09C06");

            entity.ToTable("Booked_Seats");

            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.SeatId).HasColumnName("seat_id");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");

            entity.HasOne(d => d.Booking).WithMany(p => p.BookedSeats)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Booked_Se__booki__3B75D760");

            entity.HasOne(d => d.Seat).WithMany(p => p.BookedSeats)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Booked_Se__seat___3C69FB99");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__5DE3A5B19B4A9168");

            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.BookingStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Confirmed")
                .HasColumnName("booking_status");
            entity.Property(e => e.BookingTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("booking_time");
            entity.Property(e => e.ShowtimeId).HasColumnName("showtime_id");
            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total_amount");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            //entity.HasOne(d => d.Showtime).WithMany(p => p.Bookings)
            //    .HasForeignKey(d => d.ShowtimeId)
            //    .HasConstraintName("FK__Bookings__showti__36B12243");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Bookings__user_i__35BCFE0A");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__7A6B2B8C1093FD2B");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");
            entity.Property(e => e.Comments)
                .HasColumnType("text")
                .HasColumnName("comments");
            entity.Property(e => e.MovieId).HasColumnName("movie_id");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("submitted_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            //entity.HasOne(d => d.Movie).WithMany(p => p.Feedbacks)
            //    .HasForeignKey(d => d.MovieId)
            //    .HasConstraintName("FK__Feedback__movie___403A8C7D");

            //entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
            //    .HasForeignKey(d => d.UserId)
            //    .HasConstraintName("FK__Feedback__user_i__3F466844");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("PK__Movies__83CDF74956C2BDF0");

            entity.Property(e => e.MovieId).HasColumnName("movie_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.PosterUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("poster_url");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Genre).HasColumnName("genre");
            entity.Property(e => e.ReleaseDate).HasColumnName("release_date");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.status)
                .HasColumnType("numeric(1, 0)")
                .HasColumnName("status");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__E059842F5FB4CC7F");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.Message)
                .HasColumnType("text")
                .HasColumnName("message");
            entity.Property(e => e.NotificationType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("notification_type");
            entity.Property(e => e.SentTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("sent_time");
            entity.Property(e => e.DisplayTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("display_time");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__user___44FF419A");
            entity.Property(e => e.IsRead)
                .HasColumnType("numeric(1, 0)")
                .HasColumnName("is_read");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__ED1FC9EA68526145");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.BookingId).HasColumnName("booking_id");
            entity.Property(e => e.PaymentMode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("payment_mode");
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("payment_status");
            entity.Property(e => e.PaymentTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("payment_time");

            // Add this property mapping for consume_loyaltypoint
            entity.Property(e => e.consume_loyaltypoint)
                .HasColumnName("consume_loyaltypoint")
                .HasColumnType("numeric(1, 0)");
            entity.Property(e => e.RazorpayPaymentId)
                  .HasMaxLength(100)
                  .IsUnicode(false)
                   .HasColumnName("razorpay_payment_id");
            entity.Property(e => e.RazorpayOrderId)
        .HasMaxLength(100)
        .IsUnicode(false)
        .HasColumnName("razorpay_order_id");

            entity.Property(e => e.RazorpaySignature)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("razorpay_signature");
            entity.Property(e => e.Currency)
        .HasMaxLength(10)
        .IsUnicode(false)
        .HasDefaultValue("INR")
        .HasColumnName("currency");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__Payments__bookin__48CFD27E");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("PK__Seats__906DED9C56D84A16");

            entity.Property(e => e.SeatId).HasColumnName("seat_id");
            entity.Property(e => e.IsOccupied)
                .HasColumnType("numeric(1, 0)")
                .HasColumnName("is_occupied");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.RowLabel)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("row_label");
            entity.Property(e => e.SeatNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("seat_number");
            entity.Property(e => e.TheaterId).HasColumnName("theater_id");
            entity.Property(e => e.ShowtimeId).HasColumnName("showtime_id");

            entity.HasOne(d => d.Theater).WithMany(p => p.Seats)
                .HasForeignKey(d => d.TheaterId)
                .HasConstraintName("FK__Seats__theater_i__31EC6D26");
        });

        modelBuilder.Entity<Showtime>(entity =>
        {
            entity.HasKey(e => e.ShowtimeId).HasName("PK__Showtime__A406B5181D947F30");

            entity.Property(e => e.ShowtimeId).HasColumnName("showtime_id");
            entity.Property(e => e.EndTime)
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.MovieId).HasColumnName("movie_id");
            entity.Property(e => e.StartTime)
                .HasColumnType("datetime")
                .HasColumnName("start_time");
            entity.Property(e => e.TheaterId).HasColumnName("theater_id");
            entity.Property(e => e.status)
                .HasColumnType("numeric(1, 0)")
                .HasColumnName("status");
            //entity.HasOne(d => d.Movie).WithMany(p => p.Showtimes)
            //    .HasForeignKey(d => d.MovieId)
            //    .HasConstraintName("FK__Showtimes__movie__2E1BDC42");

            //entity.HasOne(d => d.Theater).WithMany(p => p.Showtimes)
            //    .HasForeignKey(d => d.TheaterId)
            //    .HasConstraintName("FK__Showtimes__theat__2F10007B");
        });

        modelBuilder.Entity<Theater>(entity =>
        {
            entity.HasKey(e => e.TheaterId).HasName("PK__Theaters__B53C958FC4960D53");

            entity.Property(e => e.TheaterId).HasColumnName("theater_id");
            entity.Property(e => e.Location)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.status)
                .HasColumnType("numeric(1, 0)")
                .HasColumnName("status");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("address");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__B9BE370F6A9D2DC6");

            entity.HasIndex(e => e.Email, "UQ__Users__AB6E61647CF0D219").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("address");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.LoyaltyPoints)
                .HasDefaultValue(0)
                .HasColumnName("loyalty_points");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.ResetCode)
                 .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("reset_code");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}