using Karigar.Core.Interfaces.Repositories.Service;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.Service
{
    public class ServiceRepository : BaseRepository<Core.Models.Service>, IServiceRepository
    {
        private readonly ILogger<ServiceRepository> _serviceLogger;

        public ServiceRepository(AppDbContext context, ILogger<ServiceRepository> logger, ILogger<BaseRepository<Core.Models.Service>> baseLogger) 
            : base(context, baseLogger)
        {
            _serviceLogger = logger;
        }

        public async Task<IEnumerable<Core.Models.Service>> GetByServiceProviderIdAsync(Guid serviceProviderId)
        {
            _serviceLogger.LogDebug("Fetching services by provider ID: {ProviderId}", serviceProviderId);
            try
            {
                return await _dbSet
                    .Where(s => s.ServiceProviderId == serviceProviderId && !s.IsDeleted && s.IsActive)
                    .Include(s => s.ServiceCategory)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while fetching services by provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Service>> GetByCategoryIdAsync(Guid categoryId)
        {
            _serviceLogger.LogDebug("Fetching services by category ID: {CategoryId}", categoryId);
            try
            {
                return await _dbSet
                    .Where(s => s.ServiceCategoryId == categoryId && !s.IsDeleted && s.IsActive)
                    .Include(s => s.ServiceProvider)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while fetching services by category: {CategoryId}", categoryId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Service>> GetByLocationAsync(string location)
        {
            _serviceLogger.LogDebug("Fetching services by location: {Location}", location);
            try
            {
                return await _dbSet
                    .Where(s => s.Location.Contains(location) && !s.IsDeleted && s.IsActive)
                    .Include(s => s.ServiceProvider)
                    .Include(s => s.ServiceCategory)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while fetching services by location: {Location}", location);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Service>> SearchServicesAsync(string searchTerm)
        {
            _serviceLogger.LogDebug("Searching services with term: {SearchTerm}", searchTerm);
            try
            {
                return await _dbSet
                    .Where(s => (s.Title.Contains(searchTerm) || s.Description.Contains(searchTerm))
                        && !s.IsDeleted && s.IsActive)
                    .Include(s => s.ServiceProvider)
                    .Include(s => s.ServiceCategory)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while searching services: {SearchTerm}", searchTerm);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Service>> GetAvailableServicesAsync()
        {
            _serviceLogger.LogDebug("Fetching available services");
            try
            {
                return await _dbSet
                    .Where(s => s.IsAvailable && !s.IsDeleted && s.IsActive)
                    .Include(s => s.ServiceProvider)
                    .Include(s => s.ServiceCategory)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while fetching available services");
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Service>> GetServicesByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            _serviceLogger.LogDebug("Fetching services by price range: {MinPrice}-{MaxPrice}", minPrice, maxPrice);
            try
            {
                return await _dbSet
                    .Where(s => s.MinPrice >= minPrice && s.MaxPrice <= maxPrice
                        && !s.IsDeleted && s.IsActive)
                    .Include(s => s.ServiceProvider)
                    .Include(s => s.ServiceCategory)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while fetching services by price range");
                throw;
            }
        }

        public async Task<Core.Models.Service?> GetServiceWithDetailsAsync(Guid serviceId)
        {
            _serviceLogger.LogDebug("Fetching service with details: {ServiceId}", serviceId);
            try
            {
                return await _dbSet
                    .Include(s => s.ServiceProvider)
                    .Include(s => s.ServiceCategory)
                    .Include(s => s.ServiceRequests)
                    .FirstOrDefaultAsync(s => s.Id == serviceId && !s.IsDeleted);
            }
            catch (Exception ex)
            {
                _serviceLogger.LogError(ex, "Error occurred while fetching service with details: {ServiceId}", serviceId);
                throw;
            }
        }
    }
}
