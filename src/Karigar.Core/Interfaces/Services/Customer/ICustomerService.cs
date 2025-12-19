using Karigar.Core.Models;

namespace Karigar.Core.Interfaces.Services.Customer
{
    public interface ICustomerService
    {
        Task<Models.Customer> CreateCustomerAsync(Models.Customer customer);
        Task<Models.Customer?> GetCustomerByIdAsync(Guid customerId);
        Task<Models.Customer?> GetCustomerByUserIdAsync(string userId);
        Task<IEnumerable<Models.Customer>> GetAllCustomersAsync();
        Task UpdateCustomerAsync(Models.Customer customer);
        Task DeleteCustomerAsync(Guid customerId);
        Task<Models.Customer?> GetCustomerWithRequestsAsync(Guid customerId);
        Task<Models.Customer?> GetCustomerWithReviewsAsync(Guid customerId);
        Task<IEnumerable<Models.ServiceRequest>> GetCustomerBookingHistoryAsync(Guid customerId);
    }
}

