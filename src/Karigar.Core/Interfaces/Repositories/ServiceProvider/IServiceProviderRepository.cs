using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.ServiceProvider
{
    public interface IServiceProviderRepository : IBaseRepository<Models.ServiceProvider>
    {
        Task<Models.ServiceProvider?> GetByUserIdAsync(string userId);
        Task<IEnumerable<Models.ServiceProvider>> GetByLocationAsync(string city);
        Task<IEnumerable<Models.ServiceProvider>> GetBySkillAsync(string skill);
        Task<IEnumerable<Models.ServiceProvider>> GetTopRatedAsync(int count);
        Task<Models.ServiceProvider?> GetWithServicesAsync(Guid serviceProviderId);
        Task<Models.ServiceProvider?> GetWithReviewsAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.ServiceProvider>> GetVerifiedProvidersAsync();
        Task UpdateRatingAsync(Guid serviceProviderId, decimal newRating, int totalReviews);
    }
}

