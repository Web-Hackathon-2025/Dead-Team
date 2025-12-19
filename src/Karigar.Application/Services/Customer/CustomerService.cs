using Karigar.Core.Interfaces.Repositories.Customer;
using Karigar.Core.Interfaces.Services.Customer;
using Karigar.Core.Models;
using Microsoft.Extensions.Logging;

namespace Karigar.Application.Services.Customer
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ILogger<CustomerService> _logger;

        public CustomerService(ICustomerRepository customerRepository, ILogger<CustomerService> logger)
        {
            _customerRepository = customerRepository;
            _logger = logger;
        }

        public async Task<Core.Models.Customer> CreateCustomerAsync(Core.Models.Customer customer)
        {
            _logger.LogInformation("Creating customer: {FullName}", customer.FullName);
            try
            {
                var result = await _customerRepository.AddAsync(customer);
                _logger.LogInformation("Customer created successfully with ID: {CustomerId}", result.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating customer: {FullName}", customer.FullName);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetCustomerByIdAsync(Guid customerId)
        {
            _logger.LogDebug("Fetching customer by ID: {CustomerId}", customerId);
            try
            {
                return await _customerRepository.GetByIdAsync(customerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching customer: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetCustomerByUserIdAsync(string userId)
        {
            _logger.LogDebug("Fetching customer by User ID: {UserId}", userId);
            try
            {
                return await _customerRepository.GetByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching customer by user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Customer>> GetAllCustomersAsync()
        {
            _logger.LogDebug("Fetching all customers");
            try
            {
                return await _customerRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all customers");
                throw;
            }
        }

        public async Task UpdateCustomerAsync(Core.Models.Customer customer)
        {
            _logger.LogInformation("Updating customer: {CustomerId}", customer.Id);
            try
            {
                await _customerRepository.UpdateAsync(customer);
                _logger.LogInformation("Customer updated successfully: {CustomerId}", customer.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating customer: {CustomerId}", customer.Id);
                throw;
            }
        }

        public async Task DeleteCustomerAsync(Guid customerId)
        {
            _logger.LogInformation("Deleting customer: {CustomerId}", customerId);
            try
            {
                await _customerRepository.DeleteAsync(customerId);
                _logger.LogInformation("Customer deleted successfully: {CustomerId}", customerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting customer: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetCustomerWithRequestsAsync(Guid customerId)
        {
            _logger.LogDebug("Fetching customer with requests: {CustomerId}", customerId);
            try
            {
                return await _customerRepository.GetCustomerWithRequestsAsync(customerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching customer with requests: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetCustomerWithReviewsAsync(Guid customerId)
        {
            _logger.LogDebug("Fetching customer with reviews: {CustomerId}", customerId);
            try
            {
                return await _customerRepository.GetCustomerWithReviewsAsync(customerId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching customer with reviews: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetCustomerBookingHistoryAsync(Guid customerId)
        {
            _logger.LogDebug("Fetching booking history for customer: {CustomerId}", customerId);
            try
            {
                var customer = await _customerRepository.GetCustomerWithRequestsAsync(customerId);
                return customer?.ServiceRequests ?? new List<Core.Models.ServiceRequest>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching booking history for customer: {CustomerId}", customerId);
                throw;
            }
        }
    }
}
