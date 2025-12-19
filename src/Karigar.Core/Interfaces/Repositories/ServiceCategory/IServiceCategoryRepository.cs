using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.ServiceCategory
{
    public interface IServiceCategoryRepository : IBaseRepository<Models.ServiceCategory>
    {
        Task<Models.ServiceCategory?> GetByNameAsync(string name);
        Task<Models.ServiceCategory?> GetCategoryWithServicesAsync(Guid categoryId);
        Task<IEnumerable<Models.ServiceCategory>> GetActiveCategoriesAsync();
    }
}

