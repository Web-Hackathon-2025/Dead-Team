using Karigar.Core.Interfaces.Repositories.Review;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.Review
{
    public class ReviewRepository : BaseRepository<Core.Models.Review>, IReviewRepository
    {
        private readonly ILogger<ReviewRepository> _reviewLogger;

        public ReviewRepository(AppDbContext context, ILogger<ReviewRepository> logger, ILogger<BaseRepository<Core.Models.Review>> baseLogger) 
            : base(context, baseLogger)
        {
            _reviewLogger = logger;
        }

        public async Task<IEnumerable<Core.Models.Review>> GetByServiceProviderIdAsync(Guid serviceProviderId)
        {
            _reviewLogger.LogDebug("Fetching reviews by service provider ID: {ProviderId}", serviceProviderId);
            try
            {
                return await _dbSet
                    .Where(r => r.ServiceProviderId == serviceProviderId && !r.IsDeleted)
                    .Include(r => r.Customer)
                    .ThenInclude(c => c.User)
                    .OrderByDescending(r => r.ReviewDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while fetching reviews by provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Review>> GetByCustomerIdAsync(Guid customerId)
        {
            _reviewLogger.LogDebug("Fetching reviews by customer ID: {CustomerId}", customerId);
            try
            {
                return await _dbSet
                    .Where(r => r.CustomerId == customerId && !r.IsDeleted)
                    .Include(r => r.ServiceProvider)
                    .ThenInclude(sp => sp.User)
                    .Include(r => r.ServiceRequest)
                    .OrderByDescending(r => r.ReviewDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while fetching reviews by customer: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<Core.Models.Review?> GetByServiceRequestIdAsync(Guid serviceRequestId)
        {
            _reviewLogger.LogDebug("Fetching review by service request ID: {RequestId}", serviceRequestId);
            try
            {
                return await _dbSet
                    .Include(r => r.Customer)
                    .Include(r => r.ServiceProvider)
                    .Include(r => r.ServiceRequest)
                    .FirstOrDefaultAsync(r => r.ServiceRequestId == serviceRequestId && !r.IsDeleted);
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while fetching review by request: {RequestId}", serviceRequestId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Review>> GetRecentReviewsAsync(int count)
        {
            _reviewLogger.LogDebug("Fetching recent {Count} reviews", count);
            try
            {
                return await _dbSet
                    .Where(r => !r.IsDeleted)
                    .Include(r => r.Customer)
                    .ThenInclude(c => c.User)
                    .Include(r => r.ServiceProvider)
                    .ThenInclude(sp => sp.User)
                    .OrderByDescending(r => r.ReviewDate)
                    .Take(count)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while fetching recent reviews");
                throw;
            }
        }

        public async Task<decimal> GetAverageRatingAsync(Guid serviceProviderId)
        {
            _reviewLogger.LogDebug("Calculating average rating for provider: {ProviderId}", serviceProviderId);
            try
            {
                var reviews = await _dbSet
                    .Where(r => r.ServiceProviderId == serviceProviderId && !r.IsDeleted)
                    .ToListAsync();

                if (!reviews.Any())
                    return 0;

                return (decimal)reviews.Average(r => r.Rating);
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while calculating average rating: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<int> GetTotalReviewsCountAsync(Guid serviceProviderId)
        {
            _reviewLogger.LogDebug("Counting reviews for provider: {ProviderId}", serviceProviderId);
            try
            {
                return await _dbSet
                    .CountAsync(r => r.ServiceProviderId == serviceProviderId && !r.IsDeleted);
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while counting reviews: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Review>> GetTopRatedReviewsAsync(int minRating, int count)
        {
            _reviewLogger.LogDebug("Fetching top {Count} reviews with min rating: {MinRating}", count, minRating);
            try
            {
                return await _dbSet
                    .Where(r => r.Rating >= minRating && !r.IsDeleted)
                    .Include(r => r.Customer)
                    .ThenInclude(c => c.User)
                    .Include(r => r.ServiceProvider)
                    .ThenInclude(sp => sp.User)
                    .OrderByDescending(r => r.Rating)
                    .ThenByDescending(r => r.ReviewDate)
                    .Take(count)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _reviewLogger.LogError(ex, "Error occurred while fetching top rated reviews");
                throw;
            }
        }
    }
}
