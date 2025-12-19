using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.Admin
{
    public interface IAdminRepository : IBaseRepository<Models.Admin>
    {
        Task<Models.Admin?> GetByUserIdAsync(string userId);
        Task<IEnumerable<Models.Admin>> GetAdminsWithPermissionAsync(string permission);
    }
}

