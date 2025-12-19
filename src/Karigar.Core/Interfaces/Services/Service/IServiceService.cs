using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.Service
{
    public interface IServiceService
    {
        Task<Models.Service> CreateServiceAsync(Models.Service service);
        Task<Models.Service?> GetServiceByIdAsync(Guid serviceId);
        Task<IEnumerable<Models.Service>> GetAllServicesAsync();
        Task<IEnumerable<Models.Service>> GetServicesByProviderIdAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.Service>> GetServicesByCategoryIdAsync(Guid categoryId);
        Task<IEnumerable<Models.Service>> SearchServicesAsync(string searchTerm, string? location = null);
        Task<IEnumerable<Models.Service>> GetServicesByLocationAsync(string location);
        Task<IEnumerable<Models.Service>> GetServicesByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        Task<IEnumerable<Models.Service>> GetAvailableServicesAsync();
        Task<Models.Service?> GetServiceWithDetailsAsync(Guid serviceId);
        Task UpdateServiceAsync(Models.Service service);
        Task DeleteServiceAsync(Guid serviceId);
        Task ToggleServiceAvailabilityAsync(Guid serviceId);
    }
}

