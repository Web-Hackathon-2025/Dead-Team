using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.Review
{
    public interface IReviewService
    {
        Task<Models.Review> CreateReviewAsync(Models.Review review);
        Task<Models.Review?> GetReviewByIdAsync(Guid reviewId);
        Task<Models.Review?> GetReviewByServiceRequestIdAsync(Guid serviceRequestId);
        Task<IEnumerable<Models.Review>> GetReviewsByServiceProviderIdAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.Review>> GetReviewsByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<Models.Review>> GetRecentReviewsAsync(int count);
        Task<IEnumerable<Models.Review>> GetTopRatedReviewsAsync(int minRating, int count);
        Task<decimal> GetAverageRatingForProviderAsync(Guid serviceProviderId);
        Task UpdateReviewAsync(Models.Review review);
        Task DeleteReviewAsync(Guid reviewId);
    }
}

