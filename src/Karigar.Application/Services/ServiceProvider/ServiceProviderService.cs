using Karigar.Core.Interfaces.Repositories.Review;
using Karigar.Core.Interfaces.Repositories.ServiceProvider;
using Karigar.Core.Interfaces.Services.ServiceProvider;
using Microsoft.Extensions.Logging;

namespace Karigar.Application.Services.ServiceProvider
{
    public class ServiceProviderService : IServiceProviderService
    {
        private readonly IServiceProviderRepository _serviceProviderRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly ILogger<ServiceProviderService> _logger;

        public ServiceProviderService(
            IServiceProviderRepository serviceProviderRepository,
            IReviewRepository reviewRepository,
            ILogger<ServiceProviderService> logger)
        {
            _serviceProviderRepository = serviceProviderRepository;
            _reviewRepository = reviewRepository;
            _logger = logger;
        }

        public async Task<Core.Models.ServiceProvider> CreateServiceProviderAsync(Core.Models.ServiceProvider serviceProvider)
        {
            _logger.LogInformation("Creating service provider: {BusinessName}", serviceProvider.BusinessName);
            try
            {
                var result = await _serviceProviderRepository.AddAsync(serviceProvider);
                _logger.LogInformation("Service provider created successfully with ID: {ProviderId}", result.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating service provider: {BusinessName}", serviceProvider.BusinessName);
                throw;
            }
        }

        public async Task<Core.Models.ServiceProvider?> GetServiceProviderByIdAsync(Guid serviceProviderId)
        {
            _logger.LogDebug("Fetching service provider by ID: {ProviderId}", serviceProviderId);
            try
            {
                return await _serviceProviderRepository.GetByIdAsync(serviceProviderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching service provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<Core.Models.ServiceProvider?> GetServiceProviderByUserIdAsync(string userId)
        {
            _logger.LogDebug("Fetching service provider by User ID: {UserId}", userId);
            try
            {
                return await _serviceProviderRepository.GetByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching service provider by user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetAllServiceProvidersAsync()
        {
            _logger.LogDebug("Fetching all service providers");
            try
            {
                return await _serviceProviderRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all service providers");
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> SearchServiceProvidersAsync(string searchTerm, string? city = null)
        {
            _logger.LogInformation("Searching service providers with term: {SearchTerm}, City: {City}", searchTerm, city ?? "All");
            try
            {
                if (!string.IsNullOrEmpty(city))
                {
                    return await _serviceProviderRepository.GetByLocationAsync(city);
                }
                
                return await _serviceProviderRepository.GetBySkillAsync(searchTerm);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching service providers: {SearchTerm}", searchTerm);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetTopRatedServiceProvidersAsync(int count)
        {
            _logger.LogDebug("Fetching top {Count} rated service providers", count);
            try
            {
                return await _serviceProviderRepository.GetTopRatedAsync(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching top rated service providers");
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceProvider>> GetVerifiedServiceProvidersAsync()
        {
            _logger.LogDebug("Fetching verified service providers");
            try
            {
                return await _serviceProviderRepository.GetVerifiedProvidersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching verified service providers");
                throw;
            }
        }

        public async Task UpdateServiceProviderAsync(Core.Models.ServiceProvider serviceProvider)
        {
            _logger.LogInformation("Updating service provider: {ProviderId}", serviceProvider.Id);
            try
            {
                await _serviceProviderRepository.UpdateAsync(serviceProvider);
                _logger.LogInformation("Service provider updated successfully: {ProviderId}", serviceProvider.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating service provider: {ProviderId}", serviceProvider.Id);
                throw;
            }
        }

        public async Task DeleteServiceProviderAsync(Guid serviceProviderId)
        {
            _logger.LogInformation("Deleting service provider: {ProviderId}", serviceProviderId);
            try
            {
                await _serviceProviderRepository.DeleteAsync(serviceProviderId);
                _logger.LogInformation("Service provider deleted successfully: {ProviderId}", serviceProviderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting service provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<Core.Models.ServiceProvider?> GetServiceProviderWithServicesAsync(Guid serviceProviderId)
        {
            _logger.LogDebug("Fetching service provider with services: {ProviderId}", serviceProviderId);
            try
            {
                return await _serviceProviderRepository.GetWithServicesAsync(serviceProviderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching service provider with services: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<Core.Models.ServiceProvider?> GetServiceProviderWithReviewsAsync(Guid serviceProviderId)
        {
            _logger.LogDebug("Fetching service provider with reviews: {ProviderId}", serviceProviderId);
            try
            {
                return await _serviceProviderRepository.GetWithReviewsAsync(serviceProviderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching service provider with reviews: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task VerifyServiceProviderAsync(Guid serviceProviderId)
        {
            _logger.LogInformation("Verifying service provider: {ProviderId}", serviceProviderId);
            try
            {
                var provider = await _serviceProviderRepository.GetByIdAsync(serviceProviderId);
                if (provider != null)
                {
                    provider.IsVerified = true;
                    await _serviceProviderRepository.UpdateAsync(provider);
                    _logger.LogInformation("Service provider verified successfully: {ProviderId}", serviceProviderId);
                }
                else
                {
                    _logger.LogWarning("Service provider not found for verification: {ProviderId}", serviceProviderId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while verifying service provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task UpdateRatingAsync(Guid serviceProviderId)
        {
            _logger.LogDebug("Updating rating for service provider: {ProviderId}", serviceProviderId);
            try
            {
                var avgRating = await _reviewRepository.GetAverageRatingAsync(serviceProviderId);
                var totalReviews = await _reviewRepository.GetTotalReviewsCountAsync(serviceProviderId);
                await _serviceProviderRepository.UpdateRatingAsync(serviceProviderId, avgRating, totalReviews);
                _logger.LogInformation("Rating updated for service provider: {ProviderId}, Avg: {AvgRating}, Total: {TotalReviews}", 
                    serviceProviderId, avgRating, totalReviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating rating for service provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }
    }
}
