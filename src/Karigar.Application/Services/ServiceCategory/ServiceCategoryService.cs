using Karigar.Core.Interfaces.Repositories.ServiceCategory;
using Karigar.Core.Interfaces.Services.ServiceCategory;

namespace Karigar.Application.Services.ServiceCategory
{
    public class ServiceCategoryService : IServiceCategoryService
    {
        private readonly IServiceCategoryRepository _serviceCategoryRepository;

        public ServiceCategoryService(IServiceCategoryRepository serviceCategoryRepository)
        {
            _serviceCategoryRepository = serviceCategoryRepository;
        }

        public async Task<Core.Models.ServiceCategory> CreateCategoryAsync(Core.Models.ServiceCategory category)
        {
            return await _serviceCategoryRepository.AddAsync(category);
        }

        public async Task<Core.Models.ServiceCategory?> GetCategoryByIdAsync(Guid categoryId)
        {
            return await _serviceCategoryRepository.GetByIdAsync(categoryId);
        }

        public async Task<Core.Models.ServiceCategory?> GetCategoryByNameAsync(string name)
        {
            return await _serviceCategoryRepository.GetByNameAsync(name);
        }

        public async Task<IEnumerable<Core.Models.ServiceCategory>> GetAllCategoriesAsync()
        {
            return await _serviceCategoryRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Core.Models.ServiceCategory>> GetActiveCategoriesAsync()
        {
            return await _serviceCategoryRepository.GetActiveCategoriesAsync();
        }

        public async Task<Core.Models.ServiceCategory?> GetCategoryWithServicesAsync(Guid categoryId)
        {
            return await _serviceCategoryRepository.GetCategoryWithServicesAsync(categoryId);
        }

        public async Task UpdateCategoryAsync(Core.Models.ServiceCategory category)
        {
            await _serviceCategoryRepository.UpdateAsync(category);
        }

        public async Task DeleteCategoryAsync(Guid categoryId)
        {
            await _serviceCategoryRepository.DeleteAsync(categoryId);
        }
    }
}

