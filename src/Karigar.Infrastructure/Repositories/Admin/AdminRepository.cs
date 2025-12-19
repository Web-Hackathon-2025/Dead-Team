using Karigar.Core.Interfaces.Repositories.Admin;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.Admin
{
    public class AdminRepository : BaseRepository<Core.Models.Admin>, IAdminRepository
    {
        private readonly ILogger<AdminRepository> _adminLogger;

        public AdminRepository(AppDbContext context, ILogger<AdminRepository> logger, ILogger<BaseRepository<Core.Models.Admin>> baseLogger) 
            : base(context, baseLogger)
        {
            _adminLogger = logger;
        }

        public async Task<Core.Models.Admin?> GetByUserIdAsync(string userId)
        {
            _adminLogger.LogDebug("Fetching admin by User ID: {UserId}", userId);
            try
            {
                return await _dbSet
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.UserId == userId && !a.IsDeleted);
            }
            catch (Exception ex)
            {
                _adminLogger.LogError(ex, "Error occurred while fetching admin by User ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.Admin>> GetAdminsWithPermissionAsync(string permission)
        {
            _adminLogger.LogDebug("Fetching admins with permission: {Permission}", permission);
            try
            {
                return await _dbSet
                    .Where(a => a.Permissions.Contains(permission) && !a.IsDeleted && a.IsActive)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _adminLogger.LogError(ex, "Error occurred while fetching admins with permission: {Permission}", permission);
                throw;
            }
        }
    }
}
