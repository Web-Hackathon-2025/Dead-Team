using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.Service
{
    public interface IServiceRepository : IBaseRepository<Models.Service>
    {
        Task<IEnumerable<Models.Service>> GetByServiceProviderIdAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.Service>> GetByCategoryIdAsync(Guid categoryId);
        Task<IEnumerable<Models.Service>> GetByLocationAsync(string location);
        Task<IEnumerable<Models.Service>> SearchServicesAsync(string searchTerm);
        Task<IEnumerable<Models.Service>> GetAvailableServicesAsync();
        Task<IEnumerable<Models.Service>> GetServicesByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        Task<Models.Service?> GetServiceWithDetailsAsync(Guid serviceId);
    }
}

