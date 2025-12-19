using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Repositories.Customer
{
    public interface ICustomerRepository : IBaseRepository<Models.Customer>
    {
        Task<Models.Customer?> GetByUserIdAsync(string userId);
        Task<Models.Customer?> GetByPhoneNumberAsync(string phoneNumber);
        Task<IEnumerable<Models.Customer>> GetCustomersByCityAsync(string city);
        Task<Models.Customer?> GetCustomerWithRequestsAsync(Guid customerId);
        Task<Models.Customer?> GetCustomerWithReviewsAsync(Guid customerId);
    }
}

