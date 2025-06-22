using CineBookDataAccessLayer;
using CineBookDataAccessLayer.Models;
using CineBookServices.Services;
namespace CineBookServices
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
    );
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddTransient<CineBookDbContext>();
            builder.Services.AddTransient<CineBookRepository>(
                c => new CineBookRepository(c.GetRequiredService<CineBookDbContext>()));
            builder.Services.AddHttpClient<RazorpayService>();
            builder.Services.AddScoped<EmailService>();
            builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddUserSecrets<Program>(optional: true)
    .AddEnvironmentVariables();

            builder.Services.Configure<RazorpaySettings>(
    builder.Configuration.GetSection("Razorpay"));
            builder.Services.Configure<SendgridSettings>(
    builder.Configuration.GetSection("SendGrid"));

            builder.Services.AddTransient<BookingService>();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();


            app.UseHttpsRedirection();
            app.UseCors(
                options => options.WithOrigins("*").AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()
            );
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
