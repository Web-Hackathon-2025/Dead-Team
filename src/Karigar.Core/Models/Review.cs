namespace Karigar.Core.Models
{
    public class Review : BaseEntity
    {
        public Guid ServiceRequestId { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ServiceProviderId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ServiceRequest ServiceRequest { get; set; } = null!;
        public Customer Customer { get; set; } = null!;
        public ServiceProvider ServiceProvider { get; set; } = null!;
    }
}

