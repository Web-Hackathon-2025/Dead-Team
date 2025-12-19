using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.ServiceRequest
{
    public interface IServiceRequestService
    {
        Task<Models.ServiceRequest> CreateServiceRequestAsync(Models.ServiceRequest serviceRequest);
        Task<Models.ServiceRequest?> GetServiceRequestByIdAsync(Guid requestId);
        Task<IEnumerable<Models.ServiceRequest>> GetAllServiceRequestsAsync();
        Task<IEnumerable<Models.ServiceRequest>> GetRequestsByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<Models.ServiceRequest>> GetRequestsByServiceProviderIdAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.ServiceRequest>> GetRequestsByStatusAsync(ServiceRequestStatus status);
        Task<IEnumerable<Models.ServiceRequest>> GetPendingRequestsAsync();
        Task<Models.ServiceRequest?> GetRequestWithDetailsAsync(Guid requestId);
        Task UpdateServiceRequestAsync(Models.ServiceRequest serviceRequest);
        Task<bool> AcceptServiceRequestAsync(Guid requestId, decimal quotedPrice);
        Task<bool> RejectServiceRequestAsync(Guid requestId, string reason);
        Task<bool> CompleteServiceRequestAsync(Guid requestId);
        Task<bool> CancelServiceRequestAsync(Guid requestId);
        Task UpdateRequestStatusAsync(Guid requestId, ServiceRequestStatus newStatus);
    }
}

