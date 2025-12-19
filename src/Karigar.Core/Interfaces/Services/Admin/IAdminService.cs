using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.Admin
{
    public interface IAdminService
    {
        Task<Models.Admin> CreateAdminAsync(Models.Admin admin);
        Task<Models.Admin?> GetAdminByIdAsync(Guid adminId);
        Task<Models.Admin?> GetAdminByUserIdAsync(string userId);
        Task<IEnumerable<Models.Admin>> GetAllAdminsAsync();
        Task UpdateAdminAsync(Models.Admin admin);
        Task DeleteAdminAsync(Guid adminId);
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<bool> ApproveServiceProviderAsync(Guid serviceProviderId);
        Task<bool> SuspendUserAsync(string userId);
        Task<bool> RemoveServiceProviderAccountAsync(Guid serviceProviderId);
        Task<IEnumerable<Models.ServiceRequest>> GetAllServiceRequestsAsync();
        Task<IEnumerable<Models.Review>> GetAllReviewsAsync();
        Task<bool> DeleteReviewAsync(Guid reviewId);
    }
}

