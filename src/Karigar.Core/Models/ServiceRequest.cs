namespace Karigar.Core.Models
{
    public enum ServiceRequestStatus
    {
        Pending,
        Accepted,
        InProgress,
        Completed,
        Cancelled,
        Rejected
    }

    public class ServiceRequest : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Guid ServiceProviderId { get; set; }
        public Guid ServiceId { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public DateTime PreferredDate { get; set; }
        public ServiceRequestStatus Status { get; set; } = ServiceRequestStatus.Pending;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CustomerNotes { get; set; } = string.Empty;
        public string? ProviderNotes { get; set; }
        public decimal? QuotedPrice { get; set; }
        public DateTime? CompletedDate { get; set; }
        
        // Navigation properties
        public Customer Customer { get; set; } = null!;
        public ServiceProvider ServiceProvider { get; set; } = null!;
        public Service Service { get; set; } = null!;
        public Review? Review { get; set; }
    }
}

