using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.ServiceProvider
{
    public interface IServiceProviderService
    {
        Task<Models.ServiceProvider> CreateServiceProviderAsync(Models.ServiceProvider serviceProvider);
        Task<Models.ServiceProvider?> GetServiceProviderByIdAsync(Guid serviceProviderId);
        Task<Models.ServiceProvider?> GetServiceProviderByUserIdAsync(string userId);
        Task<IEnumerable<Models.ServiceProvider>> GetAllServiceProvidersAsync();
        Task<IEnumerable<Models.ServiceProvider>> SearchServiceProvidersAsync(string searchTerm, string? city = null);
        Task<IEnumerable<Models.ServiceProvider>> GetTopRatedServiceProvidersAsync(int count);
        Task<IEnumerable<Models.ServiceProvider>> GetVerifiedServiceProvidersAsync();
        Task UpdateServiceProviderAsync(Models.ServiceProvider serviceProvider);
        Task DeleteServiceProviderAsync(Guid serviceProviderId);
        Task<Models.ServiceProvider?> GetServiceProviderWithServicesAsync(Guid serviceProviderId);
        Task<Models.ServiceProvider?> GetServiceProviderWithReviewsAsync(Guid serviceProviderId);
        Task VerifyServiceProviderAsync(Guid serviceProviderId);
        Task UpdateRatingAsync(Guid serviceProviderId);
    }
}

