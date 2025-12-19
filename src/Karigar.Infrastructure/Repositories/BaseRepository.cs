using Karigar.Core.Interfaces.Repositories;
using Karigar.Core.Models;
using Karigar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace Karigar.Infrastructure.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;
        protected readonly ILogger<BaseRepository<T>> _logger;

        public BaseRepository(AppDbContext context, ILogger<BaseRepository<T>> logger)
        {
            _context = context;
            _dbSet = context.Set<T>();
            _logger = logger;
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            _logger.LogDebug("Fetching {EntityType} by ID: {Id}", typeof(T).Name, id);
            try
            {
                var entity = await _dbSet.FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
                if (entity == null)
                {
                    _logger.LogWarning("{EntityType} not found with ID: {Id}", typeof(T).Name, id);
                }
                return entity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching {EntityType} by ID: {Id}", typeof(T).Name, id);
                throw;
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            _logger.LogDebug("Fetching all {EntityType}", typeof(T).Name);
            try
            {
                return await _dbSet.Where(e => !e.IsDeleted && e.IsActive).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all {EntityType}", typeof(T).Name);
                throw;
            }
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            _logger.LogDebug("Finding {EntityType} with predicate", typeof(T).Name);
            try
            {
                return await _dbSet.Where(predicate).Where(e => !e.IsDeleted).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while finding {EntityType} with predicate", typeof(T).Name);
                throw;
            }
        }

        public async Task<T> AddAsync(T entity)
        {
            _logger.LogInformation("Adding new {EntityType}", typeof(T).Name);
            try
            {
                entity.CreatedAt = DateTime.UtcNow;
                entity.IsActive = true;
                entity.IsDeleted = false;
                await _dbSet.AddAsync(entity);
                await _context.SaveChangesAsync();
                _logger.LogInformation("{EntityType} added successfully with ID: {Id}", typeof(T).Name, entity.Id);
                return entity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding {EntityType}", typeof(T).Name);
                throw;
            }
        }

        public async Task UpdateAsync(T entity)
        {
            _logger.LogInformation("Updating {EntityType} with ID: {Id}", typeof(T).Name, entity.Id);
            try
            {
                entity.UpdatedAt = DateTime.UtcNow;
                _dbSet.Update(entity);
                await _context.SaveChangesAsync();
                _logger.LogInformation("{EntityType} updated successfully with ID: {Id}", typeof(T).Name, entity.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating {EntityType} with ID: {Id}", typeof(T).Name, entity.Id);
                throw;
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            _logger.LogInformation("Deleting {EntityType} with ID: {Id}", typeof(T).Name, id);
            try
            {
                var entity = await _dbSet.FindAsync(id);
                if (entity != null)
                {
                    entity.IsDeleted = true;
                    entity.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("{EntityType} deleted successfully with ID: {Id}", typeof(T).Name, id);
                }
                else
                {
                    _logger.LogWarning("{EntityType} not found for deletion with ID: {Id}", typeof(T).Name, id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting {EntityType} with ID: {Id}", typeof(T).Name, id);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            _logger.LogDebug("Checking existence of {EntityType} with ID: {Id}", typeof(T).Name, id);
            try
            {
                return await _dbSet.AnyAsync(e => e.Id == id && !e.IsDeleted);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking existence of {EntityType} with ID: {Id}", typeof(T).Name, id);
                throw;
            }
        }

        public async Task<int> CountAsync()
        {
            _logger.LogDebug("Counting {EntityType}", typeof(T).Name);
            try
            {
                return await _dbSet.CountAsync(e => !e.IsDeleted && e.IsActive);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while counting {EntityType}", typeof(T).Name);
                throw;
            }
        }

        public async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize)
        {
            _logger.LogDebug("Fetching paged {EntityType} - Page: {PageNumber}, Size: {PageSize}", typeof(T).Name, pageNumber, pageSize);
            try
            {
                return await _dbSet
                    .Where(e => !e.IsDeleted && e.IsActive)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching paged {EntityType}", typeof(T).Name);
                throw;
            }
        }
    }
}
