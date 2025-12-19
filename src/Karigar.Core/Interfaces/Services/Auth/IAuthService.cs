using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.Auth
{
    public interface IAuthService
    {
        Task<(bool Success, string Token, string Message)> RegisterCustomerAsync(string email, string password, string fullName, string phoneNumber);
        Task<(bool Success, string Token, string Message)> RegisterServiceProviderAsync(string email, string password, string fullName, string businessName);
        Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password);
        Task<bool> LogoutAsync(string userId);
        Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
        Task<bool> ResetPasswordAsync(string email);
        Task<ApplicationUser?> GetCurrentUserAsync(string userId);
        Task<IEnumerable<string>> GetUserRolesAsync(string userId);
        Task<bool> AssignRoleAsync(string userId, string roleName);
    }
}

