using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.ServiceCategory
{
    public interface IServiceCategoryService
    {
        Task<Models.ServiceCategory> CreateCategoryAsync(Models.ServiceCategory category);
        Task<Models.ServiceCategory?> GetCategoryByIdAsync(Guid categoryId);
        Task<Models.ServiceCategory?> GetCategoryByNameAsync(string name);
        Task<IEnumerable<Models.ServiceCategory>> GetAllCategoriesAsync();
        Task<IEnumerable<Models.ServiceCategory>> GetActiveCategoriesAsync();
        Task<Models.ServiceCategory?> GetCategoryWithServicesAsync(Guid categoryId);
        Task UpdateCategoryAsync(Models.ServiceCategory category);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}

