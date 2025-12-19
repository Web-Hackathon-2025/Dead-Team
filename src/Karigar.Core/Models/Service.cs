namespace Karigar.Core.Models
{
    public class Service : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public int? DurationInMinutes { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string Location { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        
        // Foreign Keys
        public Guid ServiceProviderId { get; set; }
        public Guid ServiceCategoryId { get; set; }
        
        // Navigation properties
        public ServiceProvider ServiceProvider { get; set; } = null!;
        public ServiceCategory ServiceCategory { get; set; } = null!;
        public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
    }
}

