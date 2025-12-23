namespace Karigar.Core.Models
{
    public class Customer : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public string? City { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        
        public ApplicationUser User { get; set; } = null!;
        public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}

