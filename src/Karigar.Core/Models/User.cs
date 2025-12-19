using Microsoft.AspNetCore.Identity;

namespace Karigar.Core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
        
        public Customer? Customer { get; set; }
        public ServiceProvider? ServiceProvider { get; set; }
        public Admin? Admin { get; set; }
    }
}
