using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class NotificationController : Controller
    {
        CineBookRepository repository;
        public NotificationController(CineBookRepository repository)
        {
            this.repository = repository;
        }

        #region GetNotifications
        [HttpGet]
        public JsonResult GetNotifications(int userId)
        {
            List<Notification> result = new List<Notification>();
            try
            {
                result = this.repository.GetNotifications(userId);
            }
            catch (Exception)
            {
                result = null;
            }
            return Json(result);
        }
        #endregion

        #region MarkAsRead
        [HttpPut]
        public JsonResult MarkAsRead(int notificationId)
        {
            string status = "";
            try
            {
                bool res = this.repository.markAsRead(notificationId);
                if (res)
                {
                    status = "Marked as Read.";
                }
                else
                {
                    status = "Try after sometime!.";
                }
            }
            catch (Exception e)
            {
                status = "Some error occured!" + e.Message;
            }
            return Json(status);
        }
        #endregion

        #region MarkAllAsRead
        [HttpPut]
        public JsonResult MarkAllAsRead(int userId)
        {
            string status = "";
            try
            {
                bool res = this.repository.markAllAsRead(userId);
                if (res)
                {
                    status = "Marked All as Read.";
                }
                else
                {
                    status = "Try after sometime!.";
                }
            }
            catch (Exception e)
            {
                status = "Some error occured!" + e.Message;
            }
            return Json(status);
        }
        #endregion

        #region AddNotification
        [HttpPost]
        public JsonResult AddNotification(Notification not)
        {
            string status = "";
            try
            {
                bool res = this.repository.AddNotification(not);
                if (res)
                {
                    status = "Success";
                }
                else
                {
                    status = "Error";
                }
            }
            catch (Exception e)
            {
                status = "Some error occured!" + e.Message;
            }
            return Json(status);
        }
        #endregion
    }
}