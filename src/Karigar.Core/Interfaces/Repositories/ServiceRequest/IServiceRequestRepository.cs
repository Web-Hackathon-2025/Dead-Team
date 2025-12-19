using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.ServiceRequest
{
    public interface IServiceRequestRepository : IBaseRepository<Models.ServiceRequest>
    {
        Task<IEnumerable<Models.ServiceRequest>> GetByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<Models.ServiceRequest>> GetByServiceProviderIdAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.ServiceRequest>> GetByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<Models.ServiceRequest>> GetByStatusAsync(ServiceRequestStatus status);
        Task<Models.ServiceRequest?> GetRequestWithDetailsAsync(Guid requestId);
        Task<IEnumerable<Models.ServiceRequest>> GetPendingRequestsAsync();
        Task<IEnumerable<Models.ServiceRequest>> GetCompletedRequestsAsync(Guid customerId);
        Task UpdateStatusAsync(Guid requestId, ServiceRequestStatus newStatus);
    }
}

