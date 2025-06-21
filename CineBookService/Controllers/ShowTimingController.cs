using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using Microsoft.AspNetCore.Mvc;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ShowTimingController : Controller
    {
        CineBookRepository repository;
        public ShowTimingController(CineBookRepository repository)
        {
            this.repository = repository;
        }

        #region AddShowTimings
        [HttpPost]
        public JsonResult AddShowTimings(ShowTiming showTiming)
        {
            Showtime showTime = new Showtime();
            string status = "";
            try
            {
                showTime.StartTime = showTiming.StartTime;
                showTime.EndTime = showTiming.EndTime;
                showTime.TheaterId = showTiming.TheaterId;
                showTime.MovieId = showTiming.MovieId;
                showTime.status = 1;
                bool res = repository.AddShowTime(showTime);
                if (res)
                {
                    status = "Successfully Add Show Time";
                }
                else
                {
                    status = "Try after sometime";
                }
            }
            catch (Exception ex)
            {
                status = "Some error occured! error : " + ex.Message;
            }
            return Json(status);
        }
        #endregion

        #region UpdateShowTime
        [HttpPut]
        public JsonResult UpdateShowTime(ShowTiming showTiming)
        {
            Showtime showTime = new Showtime();
            string status = "";
            try
            {
                showTime.StartTime = showTiming.StartTime;
                showTime.EndTime = showTiming.EndTime;
                showTime.TheaterId = showTiming.TheaterId;
                showTime.MovieId = showTiming.MovieId;
                showTime.ShowtimeId = showTiming.ShowtimeId;
                showTime.status = 1;
                bool res = repository.UpdateShowTime(showTime);
                if (res)
                {
                    status = "Successfully Update Show Time";
                }
                else
                {
                    status = "Try after sometime";
                }
            }
            catch (Exception e)
            {
                status = "Some error occured! error : " + e.Message;
            }
            return Json(status);
        }
        #endregion

        #region ViewShowTiming
        [HttpGet]
        public JsonResult ViewShowTiming(DateOnly date, int movieId, string location)
        {
            List<Theater> theater = new List<Theater>();
            try
            {
                theater = repository.ViewShowTiming(date, movieId, location);
            }
            catch (Exception)
            {

                theater = null;
            }
            return Json(theater);
        }
        #endregion

        #region GetAllShowTiming
        [HttpGet]
        public JsonResult GetAllShowTiming()
        {
            List<Showtime> res = new List<Showtime>();
            try
            {
                res = this.repository.GetShowTiming();
            }
            catch (Exception)
            {
                res = null;
            }
            return Json(res);
        }
        #endregion

        #region DeleteShowTime
        [HttpDelete]
        public JsonResult DeleteShowTime(string showTimeId)
        {
            string status = "";
            try
            {
                bool res = this.repository.DeleteShowTime(showTimeId);
                if (res)
                {
                    status = "Successfully Delete Show Time";
                }
                else
                {
                    status = "Try after sometime";
                }
            }
            catch (Exception e)
            {
                status = "Some error occured! error : " + e.Message;
            }
            return Json(status);
        }
        #endregion

        #region DeleteAllPrevShowTime
        [HttpDelete]
        public JsonResult DeleteAllPrevShowTime()
        {
            string status = "";
            try
            {
                bool? res = this.repository.DeleteAllPreviousShow();
                if (res == true)
                {
                    status = "Successfully Delete All Previous Show Time";
                }
                else if (res == false)
                {
                    status = "Try after sometime";
                }
                else
                {
                    status = "No ShowTime found of previous date";
                }
            }
            catch (Exception e)
            {
                status = "Some error occured! error : " + e.Message;
            }
            return Json(status);
        }
        #endregion

        #region GetShowtimeDetails
        [HttpGet]
        public JsonResult GetShowtimeDetails(int showtimeId)
        {
            ShowtimeDetail sh = new ShowtimeDetail();
            try
            {
                sh = this.repository.getShowtimeDetails(showtimeId);
            }
            catch (Exception)
            {
                sh = null;
            }
            return Json(sh);
        }
        #endregion
    }
}