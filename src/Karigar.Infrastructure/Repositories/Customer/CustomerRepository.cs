using Karigar.Core.Interfaces.Repositories.Customer;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.Customer
{
    public class CustomerRepository : BaseRepository<Core.Models.Customer>, ICustomerRepository
    {
        private readonly ILogger<CustomerRepository> _customerLogger;

        public CustomerRepository(AppDbContext context, ILogger<CustomerRepository> logger, ILogger<BaseRepository<Core.Models.Customer>> baseLogger) 
            : base(context, baseLogger)
        {
            _customerLogger = logger;
        }

        public async Task<Core.Models.Customer?> GetByUserIdAsync(string userId)
        {
            _customerLogger.LogDebug("Fetching customer by User ID: {UserId}", userId);
            try
            {
                var customer = await _dbSet.FirstOrDefaultAsync(c => c.UserId == userId && !c.IsDeleted);
                if (customer == null)
                {
                    _customerLogger.LogWarning("Customer not found for User ID: {UserId}", userId);
                }
                return customer;
            }
            catch (Exception ex)
            {
                _customerLogger.LogError(ex, "Error occurred while fetching customer by User ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetByPhoneNumberAsync(string phoneNumber)
        {
            _customerLogger.LogDebug("Fetching customer by Phone: {PhoneNumber}", phoneNumber);
            try
            {
                return await _dbSet.FirstOrDefaultAsync(c => c.PhoneNumber == phoneNumber && !c.IsDeleted);
            }
            catch (Exception ex)
            {
                _customerLogger.LogError(ex, "Error occurred while fetching customer by phone: {PhoneNumber}", phoneNumber);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Customer>> GetCustomersByCityAsync(string city)
        {
            _customerLogger.LogDebug("Fetching customers by city: {City}", city);
            try
            {
                return await _dbSet
                    .Where(c => c.City == city && !c.IsDeleted && c.IsActive)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _customerLogger.LogError(ex, "Error occurred while fetching customers by city: {City}", city);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetCustomerWithRequestsAsync(Guid customerId)
        {
            _customerLogger.LogDebug("Fetching customer with requests: {CustomerId}", customerId);
            try
            {
                return await _dbSet
                    .Include(c => c.ServiceRequests)
                    .ThenInclude(sr => sr.Service)
                    .FirstOrDefaultAsync(c => c.Id == customerId && !c.IsDeleted);
            }
            catch (Exception ex)
            {
                _customerLogger.LogError(ex, "Error occurred while fetching customer with requests: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<Core.Models.Customer?> GetCustomerWithReviewsAsync(Guid customerId)
        {
            _customerLogger.LogDebug("Fetching customer with reviews: {CustomerId}", customerId);
            try
            {
                return await _dbSet
                    .Include(c => c.Reviews)
                    .ThenInclude(r => r.ServiceProvider)
                    .FirstOrDefaultAsync(c => c.Id == customerId && !c.IsDeleted);
            }
            catch (Exception ex)
            {
                _customerLogger.LogError(ex, "Error occurred while fetching customer with reviews: {CustomerId}", customerId);
                throw;
            }
        }
    }
}
