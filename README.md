# 🎬 CineBook - Online Movie Ticket Booking Platform

CineBook is a full-stack movie ticket booking web application where users can seamlessly browse movies, view show timings based on location, and book tickets online. Admins can manage movie-related content and view insightful analytics. This project is built using Angular for the frontend and .NET Core 8 for the backend, with Razorpay integration for payments and SendGrid for email confirmations.

---

## 🔑 Roles

- **User**: Browse movies, check show timings, book tickets, and receive confirmation emails.
- **Admin**: Manage movies, theaters, showtimes, user feedback, and view reports with graphs.
Admin Details:
Username-punya@example.com
Password-hashed_pwd3
---

## 🧰 Tech Stack

- **Frontend**: Angular, Bootstrap
- **Backend**: .NET Core 8
- **Database**: SQL Server
- **Third-Party Integrations**:
  - **Razorpay** – for secure online payments
  - **SendGrid** – for sending booking confirmation emails

---

## 🗂️ Project Structure

```
CineBook/
│
├── CineBookApp/           # Angular frontend application
├── CineBookDAL/           # Data Access Layer (C#)
└── CineBookServices/      # Backend services in .NET Core 8
```

---

## 🚀 Features

### 🔹 User Features
- Browse and search movies by name or location
- View show timings based on selected date and location
- Book tickets with online payment (Razorpay)
- Receive booking confirmation via email (SendGrid)

### 🔹 Admin Features
- Add, edit, and delete movies, theaters, and showtimes
- View user feedback
- Analyze reports using graphical dashboards
- Secure login for admin panel

---

## 🧪 Setup & Run Instructions

### 📁 Prerequisites
- Node.js and Angular CLI installed
- .NET SDK 8 installed
- SQL Server installed
- Razorpay & SendGrid API credentials

### 🔧 Backend Setup (.NET Core)
1. Navigate to the root folder:
   ```bash
   cd CineBook/CineBookService
   ```
2. Add environment variables or user secrets for Razorpay and SendGrid.
3. Run the project:
   ```bash
   dotnet run
   ```

### 💻 Frontend Setup (Angular)
1. Navigate to the frontend folder:
   ```bash
   cd CineBook/CineBookApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Angular server:
   ```bash
   ng serve
   ```

4. Visit: `http://localhost:4200`

### 🛢️ Database Setup
- Run the provided SQL script in your SQL Server to generate required tables and seed the data.
- Use the following credentials for admin access:
  - **Username**: `admin`
  - **Password**: `admin@123` (or your provided credentials)

---

## 📊 Screenshots / Demo
*(You can add screenshots here later)*

---

## ✅ To-Do / Future Enhancements
- Add user signup/login via OAuth
- PWA support for mobile ticket booking
- Auto seat selection feature

---

## 🙏 Acknowledgements
- Razorpay for payment gateway
- SendGrid for email API
- Bootstrap for frontend components

---

## 📬 Contact
For any queries or suggestions, feel free to connect with me on [Linkedin](https://www.linkedin.com/in/aniket-goyal-21b007306).
