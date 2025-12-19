using Karigar.Core.Interfaces.Repositories.ServiceCategory;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Karigar.Infrastructure.Repositories.ServiceCategory
{
    public class ServiceCategoryRepository : BaseRepository<Core.Models.ServiceCategory>, IServiceCategoryRepository
    {
        private readonly ILogger<ServiceCategoryRepository> _categoryLogger;

        public ServiceCategoryRepository(AppDbContext context, ILogger<ServiceCategoryRepository> logger, ILogger<BaseRepository<Core.Models.ServiceCategory>> baseLogger) 
            : base(context, baseLogger)
        {
            _categoryLogger = logger;
        }

        public async Task<Core.Models.ServiceCategory?> GetByNameAsync(string name)
        {
            _categoryLogger.LogDebug("Fetching service category by name: {Name}", name);
            try
            {
                return await _dbSet.FirstOrDefaultAsync(sc => sc.Name == name && !sc.IsDeleted);
            }
            catch (Exception ex)
            {
                _categoryLogger.LogError(ex, "Error occurred while fetching category by name: {Name}", name);
                throw;
            }
        }

        public async Task<Core.Models.ServiceCategory?> GetCategoryWithServicesAsync(Guid categoryId)
        {
            _categoryLogger.LogDebug("Fetching category with services: {CategoryId}", categoryId);
            try
            {
                return await _dbSet
                    .Include(sc => sc.Services)
                    .ThenInclude(s => s.ServiceProvider)
                    .FirstOrDefaultAsync(sc => sc.Id == categoryId && !sc.IsDeleted);
            }
            catch (Exception ex)
            {
                _categoryLogger.LogError(ex, "Error occurred while fetching category with services: {CategoryId}", categoryId);
                throw;
            }
        }

        public async Task<IEnumerable<Core.Models.ServiceCategory>> GetActiveCategoriesAsync()
        {
            _categoryLogger.LogDebug("Fetching active service categories");
            try
            {
                return await _dbSet
                    .Where(sc => sc.IsActive && !sc.IsDeleted)
                    .OrderBy(sc => sc.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _categoryLogger.LogError(ex, "Error occurred while fetching active categories");
                throw;
            }
        }
    }
}
