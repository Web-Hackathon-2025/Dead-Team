using Karigar.Core.Interfaces.Repositories.ServiceRequest;
using Karigar.Core.Models;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.ServiceRequest
{
    public class ServiceRequestRepository : BaseRepository<Core.Models.ServiceRequest>, IServiceRequestRepository
    {
        private readonly ILogger<ServiceRequestRepository> _requestLogger;

        public ServiceRequestRepository(AppDbContext context, ILogger<ServiceRequestRepository> logger, ILogger<BaseRepository<Core.Models.ServiceRequest>> baseLogger) 
            : base(context, baseLogger)
        {
            _requestLogger = logger;
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetByCustomerIdAsync(Guid customerId)
        {
            _requestLogger.LogDebug("Fetching service requests by customer ID: {CustomerId}", customerId);
            try
            {
                return await _dbSet
                    .Where(sr => sr.CustomerId == customerId && !sr.IsDeleted)
                    .Include(sr => sr.Service)
                    .Include(sr => sr.ServiceProvider)
                    .OrderByDescending(sr => sr.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching requests by customer: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetByServiceProviderIdAsync(Guid serviceProviderId)
        {
            _requestLogger.LogDebug("Fetching service requests by provider ID: {ProviderId}", serviceProviderId);
            try
            {
                return await _dbSet
                    .Where(sr => sr.ServiceProviderId == serviceProviderId && !sr.IsDeleted)
                    .Include(sr => sr.Service)
                    .Include(sr => sr.Customer)
                    .OrderByDescending(sr => sr.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching requests by provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetByServiceIdAsync(Guid serviceId)
        {
            _requestLogger.LogDebug("Fetching service requests by service ID: {ServiceId}", serviceId);
            try
            {
                return await _dbSet
                    .Where(sr => sr.ServiceId == serviceId && !sr.IsDeleted)
                    .Include(sr => sr.Customer)
                    .Include(sr => sr.ServiceProvider)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching requests by service: {ServiceId}", serviceId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetByStatusAsync(ServiceRequestStatus status)
        {
            _requestLogger.LogDebug("Fetching service requests by status: {Status}", status);
            try
            {
                return await _dbSet
                    .Where(sr => sr.Status == status && !sr.IsDeleted)
                    .Include(sr => sr.Customer)
                    .Include(sr => sr.ServiceProvider)
                    .Include(sr => sr.Service)
                    .OrderByDescending(sr => sr.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching requests by status: {Status}", status);
                throw;
            }
        }

        public async Task<Core.Models.ServiceRequest?> GetRequestWithDetailsAsync(Guid requestId)
        {
            _requestLogger.LogDebug("Fetching service request with details: {RequestId}", requestId);
            try
            {
                return await _dbSet
                    .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                    .Include(sr => sr.ServiceProvider)
                    .ThenInclude(sp => sp.User)
                    .Include(sr => sr.Service)
                    .ThenInclude(s => s.ServiceCategory)
                    .Include(sr => sr.Review)
                    .FirstOrDefaultAsync(sr => sr.Id == requestId && !sr.IsDeleted);
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching request with details: {RequestId}", requestId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetPendingRequestsAsync()
        {
            _requestLogger.LogDebug("Fetching pending service requests");
            try
            {
                return await _dbSet
                    .Where(sr => sr.Status == ServiceRequestStatus.Pending && !sr.IsDeleted)
                    .Include(sr => sr.Customer)
                    .Include(sr => sr.ServiceProvider)
                    .Include(sr => sr.Service)
                    .OrderBy(sr => sr.RequestDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching pending requests");
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetCompletedRequestsAsync(Guid customerId)
        {
            _requestLogger.LogDebug("Fetching completed requests for customer: {CustomerId}", customerId);
            try
            {
                return await _dbSet
                    .Where(sr => sr.CustomerId == customerId 
                        && sr.Status == ServiceRequestStatus.Completed 
                        && !sr.IsDeleted)
                    .Include(sr => sr.Service)
                    .Include(sr => sr.ServiceProvider)
                    .Include(sr => sr.Review)
                    .OrderByDescending(sr => sr.CompletedDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while fetching completed requests: {CustomerId}", customerId);
                throw;
            }
        }

        public async Task UpdateStatusAsync(Guid requestId, ServiceRequestStatus newStatus)
        {
            _requestLogger.LogInformation("Updating status for request {RequestId} to {Status}", requestId, newStatus);
            try
            {
                var request = await _dbSet.FindAsync(requestId);
                if (request != null)
                {
                    request.Status = newStatus;
                    request.UpdatedAt = DateTime.UtcNow;
                    
                    if (newStatus == ServiceRequestStatus.Completed)
                    {
                        request.CompletedDate = DateTime.UtcNow;
                    }
                    
                    await _context.SaveChangesAsync();
                    _requestLogger.LogInformation("Status updated successfully for request: {RequestId}", requestId);
                }
            }
            catch (Exception ex)
            {
                _requestLogger.LogError(ex, "Error occurred while updating status for request: {RequestId}", requestId);
                throw;
            }
        }
    }
}
