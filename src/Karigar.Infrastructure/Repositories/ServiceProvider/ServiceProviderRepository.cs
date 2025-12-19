using Karigar.Core.Interfaces.Repositories.ServiceProvider;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.ServiceProvider
{
    public class ServiceProviderRepository : BaseRepository<Core.Models.ServiceProvider>, IServiceProviderRepository
    {
        private readonly ILogger<ServiceProviderRepository> _providerLogger;

        public ServiceProviderRepository(AppDbContext context, ILogger<ServiceProviderRepository> logger, ILogger<BaseRepository<Core.Models.ServiceProvider>> baseLogger) 
            : base(context, baseLogger)
        {
            _providerLogger = logger;
        }

        public async Task<Core.Models.ServiceProvider?> GetByUserIdAsync(string userId)
        {
            _providerLogger.LogDebug("Fetching service provider by User ID: {UserId}", userId);
            try
            {
                return await _dbSet.FirstOrDefaultAsync(sp => sp.UserId == userId && !sp.IsDeleted);
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching service provider by User ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetByLocationAsync(string city)
        {
            _providerLogger.LogDebug("Fetching service providers by city: {City}", city);
            try
            {
                return await _dbSet
                    .Where(sp => sp.City == city && !sp.IsDeleted && sp.IsActive)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching service providers by city: {City}", city);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetBySkillAsync(string skill)
        {
            _providerLogger.LogDebug("Fetching service providers by skill: {Skill}", skill);
            try
            {
                return await _dbSet
                    .Where(sp => sp.Skills.Contains(skill) && !sp.IsDeleted && sp.IsActive)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching service providers by skill: {Skill}", skill);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetTopRatedAsync(int count)
        {
            _providerLogger.LogDebug("Fetching top {Count} rated service providers", count);
            try
            {
                return await _dbSet
                    .Where(sp => !sp.IsDeleted && sp.IsActive)
                    .OrderByDescending(sp => sp.AverageRating)
                    .ThenByDescending(sp => sp.TotalReviews)
                    .Take(count)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching top rated service providers");
                throw;
            }
        }

        public async Task<Core.Models.ServiceProvider?> GetWithServicesAsync(Guid serviceProviderId)
        {
            _providerLogger.LogDebug("Fetching service provider with services: {ProviderId}", serviceProviderId);
            try
            {
                return await _dbSet
                    .Include(sp => sp.Services)
                    .ThenInclude(s => s.ServiceCategory)
                    .FirstOrDefaultAsync(sp => sp.Id == serviceProviderId && !sp.IsDeleted);
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching service provider with services: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<Core.Models.ServiceProvider?> GetWithReviewsAsync(Guid serviceProviderId)
        {
            _providerLogger.LogDebug("Fetching service provider with reviews: {ProviderId}", serviceProviderId);
            try
            {
                return await _dbSet
                    .Include(sp => sp.Reviews)
                    .ThenInclude(r => r.Customer)
                    .FirstOrDefaultAsync(sp => sp.Id == serviceProviderId && !sp.IsDeleted);
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching service provider with reviews: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetVerifiedProvidersAsync()
        {
            _providerLogger.LogDebug("Fetching verified service providers");
            try
            {
                return await _dbSet
                    .Where(sp => sp.IsVerified && !sp.IsDeleted && sp.IsActive)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while fetching verified service providers");
                throw;
            }
        }

        public async Task UpdateRatingAsync(Guid serviceProviderId, decimal newRating, int totalReviews)
        {
            _providerLogger.LogInformation("Updating rating for service provider: {ProviderId}", serviceProviderId);
            try
            {
                var provider = await _dbSet.FindAsync(serviceProviderId);
                if (provider != null)
                {
                    provider.AverageRating = newRating;
                    provider.TotalReviews = totalReviews;
                    provider.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    _providerLogger.LogInformation("Rating updated successfully for provider: {ProviderId}", serviceProviderId);
                }
            }
            catch (Exception ex)
            {
                _providerLogger.LogError(ex, "Error occurred while updating rating for provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }
    }
}
