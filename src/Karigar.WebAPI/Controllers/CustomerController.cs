using Karigar.Core.Interfaces.Services.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Karigar.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer,Admin")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(ICustomerService customerService, ILogger<CustomerController> logger)
        {
            _customerService = customerService;
            _logger = logger;
        }

        /// <summary>
        /// Get customer by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            _logger.LogInformation("Getting customer by ID: {CustomerId}", id);
            try
            {
                var customer = await _customerService.GetCustomerByIdAsync(id);
                if (customer == null)
                {
                    _logger.LogWarning("Customer not found: {CustomerId}", id);
                    return NotFound(new { message = "Customer not found" });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting customer: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving customer", error = ex.Message });
            }
        }

        /// <summary>
        /// Get customer by User ID
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCustomerByUserId(string userId)
        {
            _logger.LogInformation("Getting customer by User ID: {UserId}", userId);
            try
            {
                var customer = await _customerService.GetCustomerByUserIdAsync(userId);
                if (customer == null)
                {
                    _logger.LogWarning("Customer not found for User ID: {UserId}", userId);
                    return NotFound(new { message = "Customer not found" });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting customer by user ID: {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving customer", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all customers (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllCustomers()
        {
            _logger.LogInformation("Getting all customers");
            try
            {
                var customers = await _customerService.GetAllCustomersAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all customers");
                return StatusCode(500, new { message = "An error occurred while retrieving customers", error = ex.Message });
            }
        }

        /// <summary>
        /// Get customer with service requests
        /// </summary>
        [HttpGet("{id}/requests")]
        public async Task<IActionResult> GetCustomerWithRequests(Guid id)
        {
            _logger.LogInformation("Getting customer with requests: {CustomerId}", id);
            try
            {
                var customer = await _customerService.GetCustomerWithRequestsAsync(id);
                if (customer == null)
                {
                    _logger.LogWarning("Customer not found: {CustomerId}", id);
                    return NotFound(new { message = "Customer not found" });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting customer with requests: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving customer requests", error = ex.Message });
            }
        }

        /// <summary>
        /// Get customer with reviews
        /// </summary>
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetCustomerWithReviews(Guid id)
        {
            _logger.LogInformation("Getting customer with reviews: {CustomerId}", id);
            try
            {
                var customer = await _customerService.GetCustomerWithReviewsAsync(id);
                if (customer == null)
                {
                    _logger.LogWarning("Customer not found: {CustomerId}", id);
                    return NotFound(new { message = "Customer not found" });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting customer with reviews: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving customer reviews", error = ex.Message });
            }
        }

        /// <summary>
        /// Get customer booking history
        /// </summary>
        [HttpGet("{id}/booking-history")]
        public async Task<IActionResult> GetBookingHistory(Guid id)
        {
            _logger.LogInformation("Getting booking history for customer: {CustomerId}", id);
            try
            {
                var bookings = await _customerService.GetCustomerBookingHistoryAsync(id);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting booking history: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving booking history", error = ex.Message });
            }
        }

        /// <summary>
        /// Update customer profile
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
        {
            _logger.LogInformation("Updating customer: {CustomerId}", id);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var customer = await _customerService.GetCustomerByIdAsync(id);
                if (customer == null)
                {
                    _logger.LogWarning("Customer not found for update: {CustomerId}", id);
                    return NotFound(new { message = "Customer not found" });
                }

                customer.FullName = request.FullName;
                customer.PhoneNumber = request.PhoneNumber;
                customer.Address = request.Address;
                customer.City = request.City;
                customer.ProfilePictureUrl = request.ProfilePictureUrl;

                await _customerService.UpdateCustomerAsync(customer);
                _logger.LogInformation("Customer updated successfully: {CustomerId}", id);

                return Ok(new { message = "Customer updated successfully", customer });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating customer: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while updating customer", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete customer (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            _logger.LogInformation("Deleting customer: {CustomerId}", id);
            try
            {
                var customer = await _customerService.GetCustomerByIdAsync(id);
                if (customer == null)
                {
                    _logger.LogWarning("Customer not found for deletion: {CustomerId}", id);
                    return NotFound(new { message = "Customer not found" });
                }

                await _customerService.DeleteCustomerAsync(id);
                _logger.LogInformation("Customer deleted successfully: {CustomerId}", id);

                return Ok(new { message = "Customer deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting customer: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting customer", error = ex.Message });
            }
        }
    }

    public class UpdateCustomerRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
    }
}

