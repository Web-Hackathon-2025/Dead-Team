using Karigar.Core.Interfaces.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Karigar.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        /// <summary>
        /// Get all users (Admin only)
        /// </summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            _logger.LogInformation("Admin fetching all users");
            try
            {
                var users = await _adminService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all users");
                return StatusCode(500, new { message = "An error occurred while retrieving users", error = ex.Message });
            }
        }

        /// <summary>
        /// Get admin by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAdminById(Guid id)
        {
            _logger.LogInformation("Getting admin by ID: {AdminId}", id);
            try
            {
                var admin = await _adminService.GetAdminByIdAsync(id);
                if (admin == null)
                {
                    _logger.LogWarning("Admin not found: {AdminId}", id);
                    return NotFound(new { message = "Admin not found" });
                }

                return Ok(admin);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting admin: {AdminId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving admin", error = ex.Message });
            }
        }

        /// <summary>
        /// Get admin by User ID
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAdminByUserId(string userId)
        {
            _logger.LogInformation("Getting admin by User ID: {UserId}", userId);
            try
            {
                var admin = await _adminService.GetAdminByUserIdAsync(userId);
                if (admin == null)
                {
                    _logger.LogWarning("Admin not found for User ID: {UserId}", userId);
                    return NotFound(new { message = "Admin not found" });
                }

                return Ok(admin);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting admin by user ID: {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving admin", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all admins
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllAdmins()
        {
            _logger.LogInformation("Getting all admins");
            try
            {
                var admins = await _adminService.GetAllAdminsAsync();
                return Ok(admins);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all admins");
                return StatusCode(500, new { message = "An error occurred while retrieving admins", error = ex.Message });
            }
        }

        /// <summary>
        /// Approve/Verify service provider
        /// </summary>
        [HttpPost("service-providers/{providerId}/approve")]
        public async Task<IActionResult> ApproveServiceProvider(Guid providerId)
        {
            _logger.LogInformation("Admin approving service provider: {ProviderId}", providerId);
            try
            {
                var result = await _adminService.ApproveServiceProviderAsync(providerId);
                if (!result)
                {
                    _logger.LogWarning("Service provider not found for approval: {ProviderId}", providerId);
                    return NotFound(new { message = "Service provider not found" });
                }

                _logger.LogInformation("Service provider approved successfully: {ProviderId}", providerId);
                return Ok(new { message = "Service provider approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while approving service provider: {ProviderId}", providerId);
                return StatusCode(500, new { message = "An error occurred while approving service provider", error = ex.Message });
            }
        }

        /// <summary>
        /// Suspend user account
        /// </summary>
        [HttpPost("users/{userId}/suspend")]
        public async Task<IActionResult> SuspendUser(string userId)
        {
            _logger.LogInformation("Admin suspending user: {UserId}", userId);
            try
            {
                var result = await _adminService.SuspendUserAsync(userId);
                if (!result)
                {
                    _logger.LogWarning("User not found for suspension: {UserId}", userId);
                    return NotFound(new { message = "User not found" });
                }

                _logger.LogInformation("User suspended successfully: {UserId}", userId);
                return Ok(new { message = "User suspended successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while suspending user: {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while suspending user", error = ex.Message });
            }
        }

        /// <summary>
        /// Remove service provider account
        /// </summary>
        [HttpDelete("service-providers/{providerId}")]
        public async Task<IActionResult> RemoveServiceProvider(Guid providerId)
        {
            _logger.LogInformation("Admin removing service provider: {ProviderId}", providerId);
            try
            {
                var result = await _adminService.RemoveServiceProviderAccountAsync(providerId);
                if (!result)
                {
                    _logger.LogWarning("Service provider not found for removal: {ProviderId}", providerId);
                    return NotFound(new { message = "Service provider not found" });
                }

                _logger.LogInformation("Service provider removed successfully: {ProviderId}", providerId);
                return Ok(new { message = "Service provider account removed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while removing service provider: {ProviderId}", providerId);
                return StatusCode(500, new { message = "An error occurred while removing service provider", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all service requests (Admin oversight)
        /// </summary>
        [HttpGet("service-requests")]
        public async Task<IActionResult> GetAllServiceRequests()
        {
            _logger.LogInformation("Admin fetching all service requests");
            try
            {
                var requests = await _adminService.GetAllServiceRequestsAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all service requests");
                return StatusCode(500, new { message = "An error occurred while retrieving service requests", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all reviews (Admin oversight)
        /// </summary>
        [HttpGet("reviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            _logger.LogInformation("Admin fetching all reviews");
            try
            {
                var reviews = await _adminService.GetAllReviewsAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all reviews");
                return StatusCode(500, new { message = "An error occurred while retrieving reviews", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete review (Moderation)
        /// </summary>
        [HttpDelete("reviews/{reviewId}")]
        public async Task<IActionResult> DeleteReview(Guid reviewId)
        {
            _logger.LogInformation("Admin deleting review: {ReviewId}", reviewId);
            try
            {
                var result = await _adminService.DeleteReviewAsync(reviewId);
                if (!result)
                {
                    _logger.LogWarning("Review not found for deletion: {ReviewId}", reviewId);
                    return NotFound(new { message = "Review not found" });
                }

                _logger.LogInformation("Review deleted successfully by admin: {ReviewId}", reviewId);
                return Ok(new { message = "Review deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting review: {ReviewId}", reviewId);
                return StatusCode(500, new { message = "An error occurred while deleting review", error = ex.Message });
            }
        }

        /// <summary>
        /// Update admin profile
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(Guid id, [FromBody] UpdateAdminRequest request)
        {
            _logger.LogInformation("Updating admin: {AdminId}", id);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var admin = await _adminService.GetAdminByIdAsync(id);
                if (admin == null)
                {
                    _logger.LogWarning("Admin not found for update: {AdminId}", id);
                    return NotFound(new { message = "Admin not found" });
                }

                admin.FullName = request.FullName;
                admin.CanManageUsers = request.CanManageUsers;
                admin.CanManageServices = request.CanManageServices;
                admin.CanManageReviews = request.CanManageReviews;
                admin.CanViewReports = request.CanViewReports;

                await _adminService.UpdateAdminAsync(admin);
                _logger.LogInformation("Admin updated successfully: {AdminId}", id);

                return Ok(new { message = "Admin updated successfully", admin });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating admin: {AdminId}", id);
                return StatusCode(500, new { message = "An error occurred while updating admin", error = ex.Message });
            }
        }

        /// <summary>
        /// Get platform statistics (Dashboard)
        /// </summary>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetPlatformStatistics()
        {
            _logger.LogInformation("Admin fetching platform statistics");
            try
            {
                var users = await _adminService.GetAllUsersAsync();
                var serviceRequests = await _adminService.GetAllServiceRequestsAsync();
                var reviews = await _adminService.GetAllReviewsAsync();

                var stats = new
                {
                    totalUsers = users.Count(),
                    totalServiceRequests = serviceRequests.Count(),
                    totalReviews = reviews.Count(),
                    pendingRequests = serviceRequests.Count(sr => sr.Status == Core.Models.ServiceRequestStatus.Pending),
                    completedRequests = serviceRequests.Count(sr => sr.Status == Core.Models.ServiceRequestStatus.Completed),
                    averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching platform statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving statistics", error = ex.Message });
            }
        }
    }

    public class UpdateAdminRequest
    {
        public string FullName { get; set; } = string.Empty;
        public bool CanManageUsers { get; set; } = true;
        public bool CanManageServices { get; set; } = true;
        public bool CanManageReviews { get; set; } = true;
        public bool CanViewReports { get; set; } = true;
    }
}

