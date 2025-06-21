using Azure;
using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TheaterController : Controller
    {
        CineBookRepository repository;
        public TheaterController(CineBookRepository repository)
        {
            this.repository = repository;
        }

        #region AddTheater
        [HttpPost]
        public JsonResult AddTheater(Theaters theaters)
        {
            string status = "";
            Theater theater = new Theater();
            try
            {
                theater.Name = theaters.Name;
                theater.Location = theaters.Location;
                theater.status = 1;
                theater.Address = theaters.Address;
                bool res = repository.AddTheaters(theater);
                if (res)
                {
                    status = "Successfully added Theater";
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
        #region GetAllTheaters
        [HttpGet]
        public JsonResult GetAllTheaters()
        {
            List<Theater> lst = new List<Theater>();
            try
            {
                lst = this.repository.GetAllTheater();
            }
            catch (Exception)
            {
                lst = null;
            }
            return Json(lst);
        }
        #endregion
        #region  Update Theater
        [HttpPut]
        public JsonResult UpdateTheater(Theaters theater)
        {
            Theater t = new Theater();
            string status = "";
            try
            {
                t.TheaterId = theater.TheaterId;
                t.Location = theater.Location;
                t.Name = theater.Name;
                t.status = 1;
                t.Address = theater.Address;
                bool res = repository.updateTheater(t);
                if (res)
                {
                    status = "Successfully Updated Theater";
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
        #region  Delete Theater
        [HttpDelete]
        public JsonResult DeleteTheater(int id)
        {
            string status = "";
            try
            {
                bool res = repository.deleteTheater(id);
                if (res)
                {
                    status = "Successfully Deleted Theater";
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