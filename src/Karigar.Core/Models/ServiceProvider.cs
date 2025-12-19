namespace Karigar.Core.Models
{
    public class ServiceProvider : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;
        public string Specializations { get; set; } = string.Empty;
        public int ExperienceInYears { get; set; }
        public decimal HourlyRate { get; set; }
        public string Availability { get; set; } = string.Empty;
        public decimal AverageRating { get; set; } = 0;
        public int TotalReviews { get; set; } = 0;
        public string? ProfilePictureUrl { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public bool IsVerified { get; set; } = false;
        
        public ApplicationUser User { get; set; } = null!;
        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}

