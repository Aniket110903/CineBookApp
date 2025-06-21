using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CineBookServices.Services
{
    public class RazorpayService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public RazorpayService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;

            string apiKey = _configuration["Razorpay:Key"];
            string secret = _configuration["Razorpay:Secret"];
            var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{apiKey}:{secret}"));

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", authToken);
        }

        public async Task<string> CreateOrder(decimal amount)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.razorpay.com/v1/orders");

            var payload = new
            {
                amount = (int)(amount * 100), // Razorpay expects amount in paise
                currency = "INR",
                receipt = Guid.NewGuid().ToString(),
                payment_capture = 1
            };

            request.Content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {

                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Razorpay order creation failed: {response.StatusCode}. Details: {errorContent}");
            }

            var json = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            // Extract and return the "id" from the response
            return root.GetProperty("id").GetString();
        }
    }
}
