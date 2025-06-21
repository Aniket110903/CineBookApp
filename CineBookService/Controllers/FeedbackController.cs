using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using Microsoft.AspNetCore.Mvc;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class FeedbackController : Controller
    {
        CineBookRepository repository;
        public FeedbackController(CineBookRepository repository)
        {
            this.repository = repository;
        }

        #region AddRating
        [HttpPost]
        public JsonResult AddRating(Feedbacks Rating)

        {

            String status = "";
            try
            {
                var feedbacks = new Feedback
                {
                    UserId = Rating.UserId,
                    MovieId = Rating.MovieId,
                    Rating = Rating.Rating,
                    Comments = Rating.Comments,
                };


                bool x = repository.AddRating(feedbacks);
                if (x)
                {
                    status = "Successful Added rating";

                }
                else
                {
                    status = "Didn't Add Rating";
                }


            }

            catch (Exception ex)
            {
                status = "Some error occurred! error : " + ex.Message;

            }
            return Json(status);
        }
        #endregion
        #region Get All Feedbacks
        [HttpGet]
        public JsonResult GetAllFeedbacks()
        {
            List<Feedback> feedbacks = new List<Feedback>();
            try
            {
                feedbacks = repository.getAllFeedbacks().ToList();
            }
            catch (Exception)
            {

                feedbacks = null;
            }
            return Json(feedbacks);
        }
        #endregion
        #region delete feedbacks
        [HttpDelete]
        public JsonResult DeleteFeedback(int feedbackId)
        {
            string status = "";
            try
            {
                bool res = repository.DeleteFeedbacks(feedbackId);
                if (res)
                {
                    status = "Successfully Deleted Feedback ";
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
    }
}