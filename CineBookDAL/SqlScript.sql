USE [master]
GO
IF (EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE ('[' + name + ']' = N'CineBookDB'OR name = N'CineBookDB')))
DROP DATABASE CineBookDB

CREATE DATABASE CineBookDB
GO

USE CineBookDB
GO
IF OBJECT_ID('Users') IS NOT NULL
	DROP TABLE Users
GO

IF OBJECT_ID('Movies') IS NOT NULL
	DROP TABLE Movies
GO

IF OBJECT_ID('Showtimes') IS NOT NULL
	DROP TABLE Showtimes
GO

IF OBJECT_ID('Theaters') IS NOT NULL
	DROP TABLE Theaters
GO
IF OBJECT_ID('Seats') IS NOT NULL
	DROP TABLE Seats
GO
IF OBJECT_ID('Bookings') IS NOT NULL
	DROP TABLE Bookings
GO
IF OBJECT_ID('Booked_Seats') IS NOT NULL
	DROP TABLE Booked_Seats
GO
IF OBJECT_ID('Feedback') IS NOT NULL
	DROP TABLE Feedback
GO
IF OBJECT_ID('Notifications') IS NOT NULL
	DROP TABLE Notifications
GO
IF OBJECT_ID('Payments') IS NOT NULL
	DROP TABLE Payments
GO

CREATE TABLE Users (
user_id INT PRIMARY KEY IDENTITY(1,1),
 first_name VARCHAR(50),
 last_name VARCHAR(50),
 email VARCHAR(100) UNIQUE,
 password_hash VARCHAR(255),
 address VARCHAR(255),
 role VARCHAR(20) CHECK (role IN ('User', 'Admin')),
 loyalty_points INT DEFAULT 0,
 created_at DATETIME DEFAULT GETDATE(),
    reset_code varchar(10)
);


CREATE TABLE Movies (
 movie_id INT PRIMARY KEY IDENTITY(1,1),
 title VARCHAR(100),
description TEXT,
 rating FLOAT,
 poster_url VARCHAR(255),
 release_date DATE,
	genre VARCHAR(255),
    status numeric(1) check(status in(0,1))
);
CREATE TABLE Theaters (
 theater_id INT PRIMARY KEY IDENTITY(1,1),
 name VARCHAR(100),
 location VARCHAR(255),
    status numeric(1) check(status in(0,1)),
    address VARCHAR(255)
);

CREATE TABLE Showtimes (
 showtime_id INT PRIMARY KEY IDENTITY(1,1),
 movie_id INT FOREIGN KEY REFERENCES Movies(movie_id),
 theater_id INT FOREIGN KEY REFERENCES Theaters(theater_id),
start_time DATETIME,
 end_time DATETIME,
    status numeric(1) check(status in(0,1))
);


CREATE TABLE Seats (
 seat_id INT PRIMARY KEY IDENTITY(1,1),
 theater_id INT FOREIGN KEY REFERENCES Theaters(theater_id),
 showtime_id INT FOREIGN KEY REFERENCES Showtimes(showtime_id),
 seat_number VARCHAR(10),
 row_label VARCHAR(5),
	price float,
    is_occupied numeric(1) check(is_occupied in(0,1) )
);


CREATE TABLE Bookings (
 booking_id INT PRIMARY KEY IDENTITY(1,1),
 user_id INT FOREIGN KEY REFERENCES Users(user_id),
 showtime_id INT FOREIGN KEY REFERENCES Showtimes(showtime_id),
 total_amount DECIMAL(10,2),
 booking_status VARCHAR(20) DEFAULT 'Confirmed',
 booking_time DATETIME DEFAULT GETDATE()
);


CREATE TABLE Booked_Seats (
 booking_id INT FOREIGN KEY REFERENCES Bookings(booking_id),
 seat_id INT FOREIGN KEY REFERENCES Seats(seat_id),
 price DECIMAL(10,2),
 PRIMARY KEY (booking_id, seat_id)
);


CREATE TABLE Feedback (
 feedback_id INT PRIMARY KEY IDENTITY(1,1),
user_id INT FOREIGN KEY REFERENCES Users(user_id),
 movie_id INT FOREIGN KEY REFERENCES Movies(movie_id),
 rating INT CHECK (rating BETWEEN 1 AND 10),
 comments TEXT,
submitted_at DATETIME DEFAULT GETDATE()
);


CREATE TABLE Notifications (
 notification_id INT PRIMARY KEY IDENTITY(1,1),
 user_id INT FOREIGN KEY REFERENCES Users(user_id),
 message TEXT,
notification_type VARCHAR(50),
 sent_time DATETIME DEFAULT GETDATE(),
    is_read numeric CHECK(is_read  in(1, 0)),
    display_time DATETIME DEFAULT GETDATE()
);

CREATE TABLE Payments (
 payment_id INT PRIMARY KEY IDENTITY(1,1),
 booking_id INT FOREIGN KEY REFERENCES Bookings(booking_id),
 razorpay_payment_id VARCHAR(100),
 razorpay_order_id VARCHAR(100),
 razorpay_signature VARCHAR(255),
 payment_mode VARCHAR(50),  -- e.g., card, upi
 amount DECIMAL(10,2),
 currency VARCHAR(10) DEFAULT 'INR',
 payment_status VARCHAR(20), -- e.g., captured, failed
payment_time DATETIME DEFAULT GETDATE(),
 consume_loyaltypoint numeric CHECK (consume_loyaltypoint IN (0, 1))
);




-- Insert into Users
INSERT INTO Users (first_name, last_name, email, password_hash, address, role, loyalty_points, reset_code)
VALUES 
('Rishabh', 'Verma', 'rishabhverma4000@gmail.com', 'hashed_pwd1', 'Delhi', 'User', 50, 1234),
('Aniket', 'Sharma', 'aniketgoyal110903@gmail.com', 'hashed_pwd2', 'Mumbai', 'User', 30, 5678),
('Punya', 'Mehta', 'punya@example.com', 'hashed_pwd3', 'Bangalore', 'Admin', 00, 4321),
('Rinki', 'Patel', 'rinki@example.com', 'hashed_pwd4', 'Hyderabad', 'User', 20, 8765),
('Kasiah', 'Roy', 'kasiah@example.com', 'hashed_pwd5', 'Chennai', 'User', 10, 3456),
('Sanya', 'Rao', 'sanya@example.com', 'hashed_pwd6', 'Pune', 'User', 60, '9012'),
('Aditya', 'Kapoor', 'aditya@example.com', 'hashed_pwd7', 'Ahmedabad', 'Admin', 00, '7080');

-- Insert into Movies
INSERT INTO Movies (title, description, rating, poster_url, release_date,genre,status)
VALUES 
('The SuperMan', 'A mind-bending thriller', 9, 'assets/movieImages/Superman.jpg', '2010-07-16','Drama/Thriller',1),
('SecretFace', 'Space exploration and time', 8, 'assets/movieImages/IMG_7264.jpeg', '2014-11-07','Drama/Thriller',1),
('Pirate of the Carrabian sea', 'Virtual reality war', 9, 'assets/movieImages/IMG_7265.jpeg', '1999-03-31','Drama/Thriller',1),
('The Welwall', 'A new blade runner unearths a long-buried secret', 6, 'assets/movieImages/IMG_7266.jpeg', '2017-10-06', 'Sci-Fo/Mystery', 1),
('Minority Report', 'Precrime officer becomes a fugitive', 8, 'assets/movieImages/Superman.jpg', '2002-06-21', 'Sci-Fi/Thriller', 1),
('WolfMan', 'Soldier relives battle in alien war', 7, 'assets/movieImages/wolfman.jpg', '2014-06-06', 'Action/Sci-Fi', 1),
('Dark Horizon', 'A post-apocalyptic survival story', 0, 'assets/movieImages/IMG_7264.jpeg', '2022-09-10', 'Action/Drama', 1),
('Echoes of Time', 'A time travel mystery unraveling past secrets', 0, 'assets/movieImages/IMG_7266.jpeg', '2023-03-25', 'Sci-Fi/Mystery', 1),
('Frozen Tears', 'Love and loss in the Arctic', 0, 'assets/movieImages/wolfman.jpg', '2024-01-15', 'Romance/Drama', 1);

-- Insert into Theaters
INSERT INTO Theaters (name, location,status,address)
VALUES 
('PVR Cinemas', 'Delhi',1,'JanakCinema, Jankupuri South , Delhi,110058'),
('INOX', 'Mumbai',1,'BM Mall , Opp. Vankhade Stadium , Mumbai,480012'),
('Cinepolis', 'Bangalore',1,'Galaxy Mall,Whitefield , 570045'),
('Carnival Cinemas', 'Ahmedabad', 1, 'CG Road, Ahmedabad, 380009'),
('Miraj Cinemas', 'Pune', 1, 'Seasons Mall, Magarpatta, Pune, 411028'),
('Wave Cinemas', 'Noida', 1, 'Sector 18, Atta Market, Noida, 201301'),
('INOX Megaplex', 'Kolkata', 1, 'Quest Mall, Syed Amir Ali Ave, Kolkata, 700017'),
('SRS Cinemas', 'Faridabad', 1, 'Crown Plaza Mall, Sector 15A, Faridabad, 121007'),
('PVR ICON', 'Chennai', 1, 'VR Mall, Anna Nagar, Chennai, 600040'),
('Rajhans Cinemas', 'Surat', 1, 'Rajhans Complex, Adajan, Surat, 395009');

-- Insert into Showtimes

-- Add 5 showtimes per theater for June 12, 2025
-- Each showtime is 2.5 hours apart starting from 9:00 AM

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 1, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 1, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 1, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 1, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 1, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 2, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 2, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 2, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 2, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 2, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 2, '2025-06-11 21:00:00', '2025-06-11 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 3, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 3, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 3, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 3, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 3, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 4, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 4, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 4, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 4, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 4, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 5, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 5, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 5, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 5, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 5, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

-- For theaters 6 to 10, repeat similar pattern cycling movies:

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 6, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 6, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 6, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 6, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 6, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 7, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 7, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 7, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 7, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 7, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (3, 8, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 8, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 8, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 8, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 8, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (4, 9, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 9, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 9, '2025-06-14 15:00:00', '2025-06-14 17:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 9, '2025-06-14 18:00:00', '2025-06-14 20:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (2, 9, '2025-06-14 21:00:00', '2025-06-14 23:30:00', 1);

INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (5, 10, '2025-06-14 09:00:00', '2025-06-14 11:30:00', 1);
INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (6, 10, '2025-06-14 12:00:00', '2025-06-14 14:30:00', 1);
--INSERT INTO Showtimes (movie_id, theater_id, start_time, end_time, status) VALUES (1, 




-- Insert into Bookings
INSERT INTO Bookings (user_id, showtime_id, total_amount, booking_status)
VALUES 
(1, 1, 400.00, 'Confirmed'),
(2, 2, 250.00, 'Confirmed'),
(3, 3, 180.00, 'Pending'),
(4, 4, 500.00, 'Confirmed'),
(5, 5, 700.00, 'Pending'),
(6, 6, 600.00, 'Confirmed');



-- Insert into Feedback
INSERT INTO Feedback (user_id, movie_id, rating, comments)
VALUES 
(1, 1, 9, 'Amazing movie!'),
(2, 2, 8, 'Great visuals.'),
(3, 3, 9, 'Loved the concept!'),
(4, 4, 6, 'Deep and thrilling. Must watch.'),
(5, 5, 8, 'Outstanding screenplay!'),
(6, 6, 7, 'Good but slow paced.');

-- Insert into Notifications
INSERT INTO Notifications (user_id, message, notification_type,is_read)
VALUES 
(1, 'Your booking is confirmed.', 'Booking',0),
(2, 'Your show starts in 1 hour.', 'Reminder',0),
(3, 'Payment failed.', 'Payment',0),
(4, 'Your ticket is booked for The SuperMan.', 'Booking',0),
(5, 'Reminder: SecretFace starts soon.', 'Reminder',0),
(6, 'Payment confirmed for Pirate of the Carrabian sea.', 'Payment',0);

-- Insert into Payments
INSERT INTO Payments (
    booking_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    payment_mode,
    amount,
    currency,
    payment_status,consume_loyaltypoint
)
VALUES (
    1,
    'pay_QbPabc12345678',
    'order_Qb2FbapbexMXn8',
    'fakesignaturevalue',
    'card',
    500.00,
    'INR',
    'captured',1
),
(4, 'pay_QbPxyz12345679', 'order_Qb2XbapbexXYz1', 'signature1', 'upi', 500.00, 'INR', 'captured',1),
(6, 'pay_QbPxyz12345680', 'order_Qb2XbapbexXYz2', 'signature2', 'card', 600.00, 'INR', 'captured',0);
Go

Go
CREATE PROCEDURE InsertSeats
    @theater_id INT,
    @showtime_id INT,
    @result INT OUTPUT  -- Output parameter to return success/failure status
AS
BEGIN
    -- Declare necessary variables
    DECLARE @row CHAR(1) = 'A';  -- Start from row A
    DECLARE @seat_number INT = 1;  -- Start seat number from 1
    DECLARE @price FLOAT;  -- Variable to store the price for each seat

    -- Initialize result to 0 (failure)
    SET @result = 0;

    BEGIN TRY
        -- Loop through each row (A to M)
        WHILE @row <= 'M'
        BEGIN
            -- Determine price based on row label
            IF @row BETWEEN 'A' AND 'G'  -- Price 250 for rows A to G
                SET @price = 250;
            ELSE IF @row BETWEEN 'H' AND 'K'  -- Price 350 for rows H to K
                SET @price = 350;
            ELSE IF @row BETWEEN 'L' AND 'M'  -- Price 500 for rows L to M
                SET @price = 500;

            -- Loop through seats 1 to 13 for each row
            SET @seat_number = 1;  -- Reset seat number to 1 for each row
            WHILE @seat_number <= 13
            BEGIN
                -- Insert seat into the Seats table
                INSERT INTO Seats (theater_id, seat_number, row_label, price, is_occupied,showtime_id)
                VALUES (
                    @theater_id,  -- Use the theater_id passed as a parameter
                    CAST(@seat_number AS VARCHAR(10)),  -- Convert seat number to VARCHAR
                    @row,  -- Row label (A, B, C, ..., M)
                    @price,  -- Price based on row
                    0,  -- All seats are unoccupied (0)
                    @showtime_id
                );

                -- Increment seat number
                SET @seat_number = @seat_number + 1;
            END

            -- Move to next row (A to M)
            SET @row = CHAR(ASCII(@row) + 1);
        END

        -- If all inserts were successful, set result to 1 (success)
        SET @result = 1;
    END TRY
    BEGIN CATCH
        -- If an error occurs, set result to 0 (failure)
        SET @result = 0;

        -- Optionally, you can capture and log the error details
        -- SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
Go

DECLARE @result INT;

-- Auto-generate EXEC calls for InsertSeats for showtime_id from 1 to 50
-- Assuming theater_id = ((showtime_id - 1) / 5) + 1

DECLARE @i INT = 1;
WHILE @i <= 50
BEGIN
    DECLARE @theater_id INT = ((@i - 1) / 5) + 1;
    EXEC InsertSeats @theater_id = @theater_id, @showtime_id = @i, @result = @result OUTPUT;
    SELECT CONCAT('Execution for Showtime ', @i, ' at Theater ', @theater_id) AS Execution, @result AS Result;
    SET @i = @i + 1;
END
-- Insert into Booked_Seats
INSERT INTO Booked_Seats (booking_id, seat_id, price)
VALUES 
(1, 1, 200.00),
(1, 2, 200.00),
(2, 3, 250.00),
(3, 5, 180.00),
(4, 100, 250.00),
(4, 101, 250.00),
(5, 102, 350.00),
(6, 103, 300.00);

--Table value function
go
CREATE FUNCTION dbo.GetShowtimeDetails(@ShowtimeId INT)
RETURNS @ShowtimeDetails TABLE
(
    showtime_id INT,
    movie_id INT,
    title VARCHAR(100),
    theater_id INT,
    theater_name VARCHAR(100),
    address VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME
)
AS
BEGIN
    INSERT INTO @ShowtimeDetails
    SELECT 
        s.showtime_id,
        m.movie_id,
        m.title,
        t.theater_id,
        t.name,
        t.address,
        s.start_time,
        s.end_time
    FROM 
        Showtimes s 
    JOIN 
        Movies m ON s.movie_id = m.movie_id
    JOIN 
        Theaters t ON s.theater_id = t.theater_id
    WHERE 
        m.status = 1 AND t.status = 1 AND s.status = 1 AND s.showtime_id=@ShowtimeId;

    RETURN;
END;
go
CREATE PROCEDURE AddNotificationToAllUsers
    @message TEXT,
    @notification_type VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (user_id, message, notification_type, is_read)
    SELECT user_id, @message, @notification_type, 0
    FROM Users;


END;
go


