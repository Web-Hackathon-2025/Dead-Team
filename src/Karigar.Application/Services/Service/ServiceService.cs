using Karigar.Core.Interfaces.Repositories.Service;
using Karigar.Core.Interfaces.Services.Service;

namespace Karigar.Application.Services.Service
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;

        public ServiceService(IServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public async Task<Core.Models.Service> CreateServiceAsync(Core.Models.Service service)
        {
            return await _serviceRepository.AddAsync(service);
        }

        public async Task<Core.Models.Service?> GetServiceByIdAsync(Guid serviceId)
        {
            return await _serviceRepository.GetByIdAsync(serviceId);
        }

        public async Task<IEnumerable<Core.Models.Service>> GetAllServicesAsync()
        {
            return await _serviceRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Core.Models.Service>> GetServicesByProviderIdAsync(Guid serviceProviderId)
        {
            return await _serviceRepository.GetByServiceProviderIdAsync(serviceProviderId);
        }

        public async Task<IEnumerable<Core.Models.Service>> GetServicesByCategoryIdAsync(Guid categoryId)
        {
            return await _serviceRepository.GetByCategoryIdAsync(categoryId);
        }

        public async Task<IEnumerable<Core.Models.Service>> SearchServicesAsync(string searchTerm, string? location = null)
        {
            if (!string.IsNullOrEmpty(location))
            {
                return await _serviceRepository.GetByLocationAsync(location);
            }
            
            return await _serviceRepository.SearchServicesAsync(searchTerm);
        }

        public async Task<IEnumerable<Core.Models.Service>> GetServicesByLocationAsync(string location)
        {
            return await _serviceRepository.GetByLocationAsync(location);
        }

        public async Task<IEnumerable<Core.Models.Service>> GetServicesByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _serviceRepository.GetServicesByPriceRangeAsync(minPrice, maxPrice);
        }

        public async Task<IEnumerable<Core.Models.Service>> GetAvailableServicesAsync()
        {
            return await _serviceRepository.GetAvailableServicesAsync();
        }

        public async Task<Core.Models.Service?> GetServiceWithDetailsAsync(Guid serviceId)
        {
            return await _serviceRepository.GetServiceWithDetailsAsync(serviceId);
        }

        public async Task UpdateServiceAsync(Core.Models.Service service)
        {
            await _serviceRepository.UpdateAsync(service);
        }

        public async Task DeleteServiceAsync(Guid serviceId)
        {
            await _serviceRepository.DeleteAsync(serviceId);
        }

        public async Task ToggleServiceAvailabilityAsync(Guid serviceId)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service != null)
            {
                service.IsAvailable = !service.IsAvailable;
                await _serviceRepository.UpdateAsync(service);
            }
        }
    }
}

