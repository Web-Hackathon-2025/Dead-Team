namespace Karigar.Core.Models
{
    public class ServiceCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        
        // Navigation properties
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}

