using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.Review
{
    public interface IReviewRepository : IBaseRepository<Models.Review>
    {
        Task<IEnumerable<Models.Review>> GetByServiceProviderIdAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.Review>> GetByCustomerIdAsync(Guid customerId);
        Task<Models.Review?> GetByServiceRequestIdAsync(Guid serviceRequestId);
        Task<IEnumerable<Models.Review>> GetRecentReviewsAsync(int count);
        Task<decimal> GetAverageRatingAsync(Guid serviceProviderId);
        Task<int> GetTotalReviewsCountAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.Review>> GetTopRatedReviewsAsync(int minRating, int count);
    }
}

