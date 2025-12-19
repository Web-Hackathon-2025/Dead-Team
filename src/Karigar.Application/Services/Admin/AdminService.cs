using Karigar.Core.Interfaces.Repositories.Admin;
using Karigar.Core.Interfaces.Repositories.Review;
using Karigar.Core.Interfaces.Repositories.ServiceProvider;
using Karigar.Core.Interfaces.Repositories.ServiceRequest;
using Karigar.Core.Interfaces.Services.Admin;
using Karigar.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Karigar.Application.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IServiceProviderRepository _serviceProviderRepository;
        private readonly IServiceRequestRepository _serviceRequestRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AdminService> _logger;

        public AdminService(
            IAdminRepository adminRepository,
            IServiceProviderRepository serviceProviderRepository,
            IServiceRequestRepository serviceRequestRepository,
            IReviewRepository reviewRepository,
            UserManager<ApplicationUser> userManager,
            ILogger<AdminService> logger)
        {
            _adminRepository = adminRepository;
            _serviceProviderRepository = serviceProviderRepository;
            _serviceRequestRepository = serviceRequestRepository;
            _reviewRepository = reviewRepository;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<Core.Models.Admin> CreateAdminAsync(Core.Models.Admin admin)
        {
            _logger.LogInformation("Creating admin: {FullName}", admin.FullName);
            try
            {
                var result = await _adminRepository.AddAsync(admin);
                _logger.LogInformation("Admin created successfully with ID: {AdminId}", result.Id);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating admin: {FullName}", admin.FullName);
                throw;
            }
        }

        public async Task<Core.Models.Admin?> GetAdminByIdAsync(Guid adminId)
        {
            _logger.LogDebug("Fetching admin by ID: {AdminId}", adminId);
            try
            {
                return await _adminRepository.GetByIdAsync(adminId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching admin: {AdminId}", adminId);
                throw;
            }
        }

        public async Task<Core.Models.Admin?> GetAdminByUserIdAsync(string userId)
        {
            _logger.LogDebug("Fetching admin by User ID: {UserId}", userId);
            try
            {
                return await _adminRepository.GetByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching admin by user ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Admin>> GetAllAdminsAsync()
        {
            _logger.LogDebug("Fetching all admins");
            try
            {
                return await _adminRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all admins");
                throw;
            }
        }

        public async Task UpdateAdminAsync(Core.Models.Admin admin)
        {
            _logger.LogInformation("Updating admin: {AdminId}", admin.Id);
            try
            {
                await _adminRepository.UpdateAsync(admin);
                _logger.LogInformation("Admin updated successfully: {AdminId}", admin.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating admin: {AdminId}", admin.Id);
                throw;
            }
        }

        public async Task DeleteAdminAsync(Guid adminId)
        {
            _logger.LogInformation("Deleting admin: {AdminId}", adminId);
            try
            {
                await _adminRepository.DeleteAsync(adminId);
                _logger.LogInformation("Admin deleted successfully: {AdminId}", adminId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting admin: {AdminId}", adminId);
                throw;
            }
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
        {
            _logger.LogDebug("Fetching all users");
            try
            {
                return _userManager.Users.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all users");
                throw;
            }
        }

        public async Task<bool> ApproveServiceProviderAsync(Guid serviceProviderId)
        {
            _logger.LogInformation("Approving service provider: {ProviderId}", serviceProviderId);
            try
            {
                var provider = await _serviceProviderRepository.GetByIdAsync(serviceProviderId);
                if (provider == null)
                {
                    _logger.LogWarning("Service provider not found for approval: {ProviderId}", serviceProviderId);
                    return false;
                }

                provider.IsVerified = true;
                await _serviceProviderRepository.UpdateAsync(provider);
                _logger.LogInformation("Service provider approved successfully: {ProviderId}", serviceProviderId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while approving service provider: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<bool> SuspendUserAsync(string userId)
        {
            _logger.LogInformation("Suspending user: {UserId}", userId);
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for suspension: {UserId}", userId);
                    return false;
                }

                user.IsActive = false;
                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User suspended successfully: {UserId}", userId);
                }
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while suspending user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> RemoveServiceProviderAccountAsync(Guid serviceProviderId)
        {
            _logger.LogInformation("Removing service provider account: {ProviderId}", serviceProviderId);
            try
            {
                await _serviceProviderRepository.DeleteAsync(serviceProviderId);
                _logger.LogInformation("Service provider account removed successfully: {ProviderId}", serviceProviderId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while removing service provider account: {ProviderId}", serviceProviderId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceRequest>> GetAllServiceRequestsAsync()
        {
            _logger.LogDebug("Fetching all service requests");
            try
            {
                return await _serviceRequestRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all service requests");
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Review>> GetAllReviewsAsync()
        {
            _logger.LogDebug("Fetching all reviews");
            try
            {
                return await _reviewRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all reviews");
                throw;
            }
        }

        public async Task<bool> DeleteReviewAsync(Guid reviewId)
        {
            _logger.LogInformation("Deleting review: {ReviewId}", reviewId);
            try
            {
                await _reviewRepository.DeleteAsync(reviewId);
                _logger.LogInformation("Review deleted successfully: {ReviewId}", reviewId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting review: {ReviewId}", reviewId);
                throw;
            }
        }
    }
}
