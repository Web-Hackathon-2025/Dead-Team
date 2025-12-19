using Karigar.Core.Interfaces.Repositories.Review;
using Karigar.Core.Interfaces.Repositories.ServiceProvider;
using Karigar.Core.Interfaces.Services.Review;

namespace Karigar.Application.Services.Review
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IServiceProviderRepository _serviceProviderRepository;

        public ReviewService(
            IReviewRepository reviewRepository,
            IServiceProviderRepository serviceProviderRepository)
        {
            _reviewRepository = reviewRepository;
            _serviceProviderRepository = serviceProviderRepository;
        }

        public async Task<Core.Models.Review> CreateReviewAsync(Core.Models.Review review)
        {
            review.ReviewDate = DateTime.UtcNow;
            var createdReview = await _reviewRepository.AddAsync(review);
            
            // Update service provider rating
            await UpdateServiceProviderRatingAsync(review.ServiceProviderId);
            
            return createdReview;
        }

        public async Task<Core.Models.Review?> GetReviewByIdAsync(Guid reviewId)
        {
            return await _reviewRepository.GetByIdAsync(reviewId);
        }

        public async Task<Core.Models.Review?> GetReviewByServiceRequestIdAsync(Guid serviceRequestId)
        {
            return await _reviewRepository.GetByServiceRequestIdAsync(serviceRequestId);
        }

        public async Task<IEnumerable<Core.Models.Review>> GetReviewsByServiceProviderIdAsync(Guid serviceProviderId)
        {
            return await _reviewRepository.GetByServiceProviderIdAsync(serviceProviderId);
        }

        public async Task<IEnumerable<Core.Models.Review>> GetReviewsByCustomerIdAsync(Guid customerId)
        {
            return await _reviewRepository.GetByCustomerIdAsync(customerId);
        }

        public async Task<IEnumerable<Core.Models.Review>> GetRecentReviewsAsync(int count)
        {
            return await _reviewRepository.GetRecentReviewsAsync(count);
        }

        public async Task<IEnumerable<Core.Models.Review>> GetTopRatedReviewsAsync(int minRating, int count)
        {
            return await _reviewRepository.GetTopRatedReviewsAsync(minRating, count);
        }

        public async Task<decimal> GetAverageRatingForProviderAsync(Guid serviceProviderId)
        {
            return await _reviewRepository.GetAverageRatingAsync(serviceProviderId);
        }

        public async Task UpdateReviewAsync(Core.Models.Review review)
        {
            await _reviewRepository.UpdateAsync(review);
            
            // Update service provider rating
            await UpdateServiceProviderRatingAsync(review.ServiceProviderId);
        }

        public async Task DeleteReviewAsync(Guid reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review != null)
            {
                var serviceProviderId = review.ServiceProviderId;
                await _reviewRepository.DeleteAsync(reviewId);
                
                // Update service provider rating
                await UpdateServiceProviderRatingAsync(serviceProviderId);
            }
        }

        private async Task UpdateServiceProviderRatingAsync(Guid serviceProviderId)
        {
            var avgRating = await _reviewRepository.GetAverageRatingAsync(serviceProviderId);
            var totalReviews = await _reviewRepository.GetTotalReviewsCountAsync(serviceProviderId);
            await _serviceProviderRepository.UpdateRatingAsync(serviceProviderId, avgRating, totalReviews);
        }
    }
}

