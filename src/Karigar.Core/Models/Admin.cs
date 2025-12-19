namespace Karigar.Core.Models
{
    public class Admin : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Permissions { get; set; } = string.Empty; // JSON or comma-separated
        public bool CanManageUsers { get; set; } = true;
        public bool CanManageServices { get; set; } = true;
        public bool CanManageReviews { get; set; } = true;
        public bool CanViewReports { get; set; } = true;
        
        // Navigation properties
        public ApplicationUser User { get; set; } = null!;
    }
}

