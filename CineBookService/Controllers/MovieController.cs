using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Model;
using Microsoft.AspNetCore.Mvc;

namespace CineBookServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]


    public class MovieController : Controller
    {
        CineBookRepository repository;
        public MovieController(CineBookRepository repository)
        {
            this.repository = repository;
        }

        #region GetAllMovies
        [HttpGet]
        public List<Movie> GetAllMovies()
        {
            List<Movie> movies = new List<Movie>();
            try
            {
                movies = repository.GetAllMovies();

            }
            catch (Exception)
            {

                movies = null;
            }
            return movies;

        }
        #endregion

        #region AddMovie
        [HttpPost]
        public JsonResult AddMovie(Movies movies)
        {
            Movie movie = new Movie();
            string status = "";
            try
            {
                movie.Title = movies.Title;
                movie.PosterUrl = movies.PosterUrl;
                movie.Description = movies.Description;
                movie.ReleaseDate = movies.ReleaseDate;
                movie.Genre = movies.Genre;
                movie.status = 1;
                movie.Rating = 0.0;
                bool res = repository.AddMovie(movie);
                if (res)
                {
                    status = "Successfully added Movie";
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

        #region UpdateMovie
        [HttpPut]
        public JsonResult UpdateMovie(Movies movies)
        {
            Movie movie = new Movie();
            string status = "";
            try
            {
                movie.MovieId = movies.MovieId;
                movie.Title = movies.Title;
                movie.PosterUrl = movies.PosterUrl;
                movie.Description = movies.Description;
                movie.ReleaseDate = movies.ReleaseDate;
                movie.Genre = movies.Genre;
                movie.status = 1;
                bool res = repository.UpdateMovie(movie);
                if (res)
                {
                    status = "Successfully Updated Movie";
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

        #region MovieDetails
        [HttpGet]
        public JsonResult GetMovieDetails(int movieId)
        {
            Movie movie = new Movie();
            try
            {
                movie = repository.GetMovieDetails(movieId);
            }
            catch (Exception)
            {

                movie = null;
            }
            return Json(movie);
        }
        #endregion

        #region DeleteMovie
        [HttpDelete]
        public JsonResult DeleteMovie(string MovieId)
        {
            string status = "";
            try
            {
                bool res = this.repository.DeleteMovie(MovieId);
                if (res)
                {
                    status = "Successfully Deleted Movie";
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