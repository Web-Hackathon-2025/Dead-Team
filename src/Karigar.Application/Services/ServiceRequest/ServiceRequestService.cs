using Karigar.Core.Interfaces.Repositories.ServiceRequest;
using Karigar.Core.Interfaces.Services.ServiceRequest;
using Karigar.Core.Models;

namespace Karigar.Application.Services.ServiceRequest
{
    public class ServiceRequestService : IServiceRequestService
    {
        private readonly IServiceRequestRepository _serviceRequestRepository;

        public ServiceRequestService(IServiceRequestRepository serviceRequestRepository)
        {
            _serviceRequestRepository = serviceRequestRepository;
        }

        public async Task<Core.Models.ServiceRequest> CreateServiceRequestAsync(Core.Models.ServiceRequest serviceRequest)
        {
            serviceRequest.Status = ServiceRequestStatus.Pending;
            serviceRequest.RequestDate = DateTime.UtcNow;
            return await _serviceRequestRepository.AddAsync(serviceRequest);
        }

        public async Task<Core.Models.ServiceRequest?> GetServiceRequestByIdAsync(Guid requestId)
        {
            return await _serviceRequestRepository.GetByIdAsync(requestId);
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetAllServiceRequestsAsync()
        {
            return await _serviceRequestRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetRequestsByCustomerIdAsync(Guid customerId)
        {
            return await _serviceRequestRepository.GetByCustomerIdAsync(customerId);
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetRequestsByServiceProviderIdAsync(Guid serviceProviderId)
        {
            return await _serviceRequestRepository.GetByServiceProviderIdAsync(serviceProviderId);
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetRequestsByStatusAsync(ServiceRequestStatus status)
        {
            return await _serviceRequestRepository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetPendingRequestsAsync()
        {
            return await _serviceRequestRepository.GetPendingRequestsAsync();
        }

        public async Task<Core.Models.ServiceRequest?> GetRequestWithDetailsAsync(Guid requestId)
        {
            return await _serviceRequestRepository.GetRequestWithDetailsAsync(requestId);
        }

        public async Task UpdateServiceRequestAsync(Core.Models.ServiceRequest serviceRequest)
        {
            await _serviceRequestRepository.UpdateAsync(serviceRequest);
        }

        public async Task<bool> AcceptServiceRequestAsync(Guid requestId, decimal quotedPrice)
        {
            var request = await _serviceRequestRepository.GetByIdAsync(requestId);
            if (request == null || request.Status != ServiceRequestStatus.Pending)
                return false;

            request.Status = ServiceRequestStatus.Accepted;
            request.QuotedPrice = quotedPrice;
            await _serviceRequestRepository.UpdateAsync(request);
            return true;
        }

        public async Task<bool> RejectServiceRequestAsync(Guid requestId, string reason)
        {
            var request = await _serviceRequestRepository.GetByIdAsync(requestId);
            if (request == null)
                return false;

            request.Status = ServiceRequestStatus.Rejected;
            request.ProviderNotes = reason;
            await _serviceRequestRepository.UpdateAsync(request);
            return true;
        }

        public async Task<bool> CompleteServiceRequestAsync(Guid requestId)
        {
            var request = await _serviceRequestRepository.GetByIdAsync(requestId);
            if (request == null)
                return false;

            request.Status = ServiceRequestStatus.Completed;
            request.CompletedDate = DateTime.UtcNow;
            await _serviceRequestRepository.UpdateAsync(request);
            return true;
        }

        public async Task<bool> CancelServiceRequestAsync(Guid requestId)
        {
            var request = await _serviceRequestRepository.GetByIdAsync(requestId);
            if (request == null)
                return false;

            request.Status = ServiceRequestStatus.Cancelled;
            await _serviceRequestRepository.UpdateAsync(request);
            return true;
        }

        public async Task UpdateRequestStatusAsync(Guid requestId, ServiceRequestStatus newStatus)
        {
            await _serviceRequestRepository.UpdateStatusAsync(requestId, newStatus);
        }
    }
}

