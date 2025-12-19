using Karigar.Core.Interfaces.Services.ServiceProvider;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Karigar.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceProviderController : ControllerBase
    {
        private readonly IServiceProviderService _serviceProviderService;
        private readonly ILogger<ServiceProviderController> _logger;

        public ServiceProviderController(IServiceProviderService serviceProviderService, ILogger<ServiceProviderController> logger)
        {
            _serviceProviderService = serviceProviderService;
            _logger = logger;
        }

        /// <summary>
        /// Get service provider by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceProviderById(Guid id)
        {
            _logger.LogInformation("Getting service provider by ID: {ProviderId}", id);
            try
            {
                var provider = await _serviceProviderService.GetServiceProviderByIdAsync(id);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found: {ProviderId}", id);
                    return NotFound(new { message = "Service provider not found" });
                }

                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting service provider: {ProviderId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving service provider", error = ex.Message });
            }
        }

        /// <summary>
        /// Get service provider by User ID
        /// </summary>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "ServiceProvider,Admin")]
        public async Task<IActionResult> GetServiceProviderByUserId(string userId)
        {
            _logger.LogInformation("Getting service provider by User ID: {UserId}", userId);
            try
            {
                var provider = await _serviceProviderService.GetServiceProviderByUserIdAsync(userId);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found for User ID: {UserId}", userId);
                    return NotFound(new { message = "Service provider not found" });
                }

                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting service provider by user ID: {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving service provider", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all service providers
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllServiceProviders()
        {
            _logger.LogInformation("Getting all service providers");
            try
            {
                var providers = await _serviceProviderService.GetAllServiceProvidersAsync();
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all service providers");
                return StatusCode(500, new { message = "An error occurred while retrieving service providers", error = ex.Message });
            }
        }

        /// <summary>
        /// Search service providers
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchServiceProviders([FromQuery] string searchTerm, [FromQuery] string? city = null)
        {
            _logger.LogInformation("Searching service providers: {SearchTerm}, City: {City}", searchTerm, city ?? "All");
            try
            {
                var providers = await _serviceProviderService.SearchServiceProvidersAsync(searchTerm, city);
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching service providers");
                return StatusCode(500, new { message = "An error occurred while searching service providers", error = ex.Message });
            }
        }

        /// <summary>
        /// Get top rated service providers
        /// </summary>
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedProviders([FromQuery] int count = 10)
        {
            _logger.LogInformation("Getting top {Count} rated service providers", count);
            try
            {
                var providers = await _serviceProviderService.GetTopRatedServiceProvidersAsync(count);
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting top rated providers");
                return StatusCode(500, new { message = "An error occurred while retrieving top rated providers", error = ex.Message });
            }
        }

        /// <summary>
        /// Get verified service providers
        /// </summary>
        [HttpGet("verified")]
        public async Task<IActionResult> GetVerifiedProviders()
        {
            _logger.LogInformation("Getting verified service providers");
            try
            {
                var providers = await _serviceProviderService.GetVerifiedServiceProvidersAsync();
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting verified providers");
                return StatusCode(500, new { message = "An error occurred while retrieving verified providers", error = ex.Message });
            }
        }

        /// <summary>
        /// Get service provider with services
        /// </summary>
        [HttpGet("{id}/services")]
        public async Task<IActionResult> GetProviderWithServices(Guid id)
        {
            _logger.LogInformation("Getting service provider with services: {ProviderId}", id);
            try
            {
                var provider = await _serviceProviderService.GetServiceProviderWithServicesAsync(id);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found: {ProviderId}", id);
                    return NotFound(new { message = "Service provider not found" });
                }

                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting provider with services: {ProviderId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving provider services", error = ex.Message });
            }
        }

        /// <summary>
        /// Get service provider with reviews
        /// </summary>
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetProviderWithReviews(Guid id)
        {
            _logger.LogInformation("Getting service provider with reviews: {ProviderId}", id);
            try
            {
                var provider = await _serviceProviderService.GetServiceProviderWithReviewsAsync(id);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found: {ProviderId}", id);
                    return NotFound(new { message = "Service provider not found" });
                }

                return Ok(provider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting provider with reviews: {ProviderId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving provider reviews", error = ex.Message });
            }
        }

        /// <summary>
        /// Update service provider profile
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "ServiceProvider,Admin")]
        public async Task<IActionResult> UpdateServiceProvider(Guid id, [FromBody] UpdateServiceProviderRequest request)
        {
            _logger.LogInformation("Updating service provider: {ProviderId}", id);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var provider = await _serviceProviderService.GetServiceProviderByIdAsync(id);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found for update: {ProviderId}", id);
                    return NotFound(new { message = "Service provider not found" });
                }

                provider.BusinessName = request.BusinessName;
                provider.Skills = request.Skills;
                provider.Specializations = request.Specializations;
                provider.ExperienceInYears = request.ExperienceInYears;
                provider.HourlyRate = request.HourlyRate;
                provider.Availability = request.Availability;
                provider.Address = request.Address;
                provider.City = request.City;
                provider.PhoneNumber = request.PhoneNumber;
                provider.ProfilePictureUrl = request.ProfilePictureUrl;

                await _serviceProviderService.UpdateServiceProviderAsync(provider);
                _logger.LogInformation("Service provider updated successfully: {ProviderId}", id);

                return Ok(new { message = "Service provider updated successfully", provider });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating service provider: {ProviderId}", id);
                return StatusCode(500, new { message = "An error occurred while updating service provider", error = ex.Message });
            }
        }

        /// <summary>
        /// Verify service provider (Admin only)
        /// </summary>
        [HttpPost("{id}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyProvider(Guid id)
        {
            _logger.LogInformation("Verifying service provider: {ProviderId}", id);
            try
            {
                await _serviceProviderService.VerifyServiceProviderAsync(id);
                _logger.LogInformation("Service provider verified successfully: {ProviderId}", id);
                return Ok(new { message = "Service provider verified successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while verifying service provider: {ProviderId}", id);
                return StatusCode(500, new { message = "An error occurred while verifying service provider", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete service provider (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteServiceProvider(Guid id)
        {
            _logger.LogInformation("Deleting service provider: {ProviderId}", id);
            try
            {
                var provider = await _serviceProviderService.GetServiceProviderByIdAsync(id);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found for deletion: {ProviderId}", id);
                    return NotFound(new { message = "Service provider not found" });
                }

                await _serviceProviderService.DeleteServiceProviderAsync(id);
                _logger.LogInformation("Service provider deleted successfully: {ProviderId}", id);

                return Ok(new { message = "Service provider deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting service provider: {ProviderId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting service provider", error = ex.Message });
            }
        }
    }

    public class UpdateServiceProviderRequest
    {
        public string BusinessName { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
        public string Specializations { get; set; } = string.Empty;
        public int ExperienceInYears { get; set; }
        public decimal HourlyRate { get; set; }
        public string Availability { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }
}

