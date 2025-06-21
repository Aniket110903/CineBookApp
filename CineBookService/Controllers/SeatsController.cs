using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CineBookServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeatsController : Controller
    {
        private readonly CineBookRepository repository;
        private readonly CineBookDbContext context;
        public SeatsController(CineBookRepository repository, CineBookDbContext context)
        {
            this.repository = repository;
            this.context = context;
        }
        [HttpGet]
        #region GetSeatByShowTime
        public JsonResult GetSeatByShowTime(int showtimeId)
        {
            if (showtimeId <= 0)
            {
                return Json("Invalid or missing showtimeId");
            }
            var result = repository.GetSeatStatusByshowTime(showtimeId);
            return Json(result);
        }
        #endregion
    }
}