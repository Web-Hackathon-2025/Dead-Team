using Karigar.Core.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Karigar.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Customer> Customers { get; set; }
        public DbSet<ServiceProvider> ServiceProviders { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ApplicationUser Configuration
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.HasOne(u => u.Customer)
                    .WithOne(c => c.User)
                    .HasForeignKey<Customer>(c => c.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.ServiceProvider)
                    .WithOne(sp => sp.User)
                    .HasForeignKey<ServiceProvider>(sp => sp.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.Admin)
                    .WithOne(a => a.User)
                    .HasForeignKey<Admin>(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Customer Configuration
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.FullName).IsRequired().HasMaxLength(200);
                entity.Property(c => c.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(c => c.Address).HasMaxLength(500);
                entity.Property(c => c.City).HasMaxLength(100);

                entity.HasMany(c => c.ServiceRequests)
                    .WithOne(sr => sr.Customer)
                    .HasForeignKey(sr => sr.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(c => c.Reviews)
                    .WithOne(r => r.Customer)
                    .HasForeignKey(r => r.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ServiceProvider Configuration
            modelBuilder.Entity<ServiceProvider>(entity =>
            {
                entity.HasKey(sp => sp.Id);
                entity.Property(sp => sp.BusinessName).IsRequired().HasMaxLength(200);
                entity.Property(sp => sp.Skills).HasMaxLength(500);
                entity.Property(sp => sp.Specializations).HasMaxLength(500);
                entity.Property(sp => sp.Address).HasMaxLength(500);
                entity.Property(sp => sp.City).HasMaxLength(100);
                entity.Property(sp => sp.HourlyRate).HasColumnType("decimal(18,2)");
                entity.Property(sp => sp.AverageRating).HasColumnType("decimal(3,2)");

                entity.HasMany(sp => sp.Services)
                    .WithOne(s => s.ServiceProvider)
                    .HasForeignKey(s => s.ServiceProviderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(sp => sp.ServiceRequests)
                    .WithOne(sr => sr.ServiceProvider)
                    .HasForeignKey(sr => sr.ServiceProviderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(sp => sp.Reviews)
                    .WithOne(r => r.ServiceProvider)
                    .HasForeignKey(r => r.ServiceProviderId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Admin Configuration
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.FullName).IsRequired().HasMaxLength(200);
            });

            // ServiceCategory Configuration
            modelBuilder.Entity<ServiceCategory>(entity =>
            {
                entity.HasKey(sc => sc.Id);
                entity.Property(sc => sc.Name).IsRequired().HasMaxLength(100);
                entity.Property(sc => sc.Description).HasMaxLength(500);
                entity.HasIndex(sc => sc.Name).IsUnique();

                entity.HasMany(sc => sc.Services)
                    .WithOne(s => s.ServiceCategory)
                    .HasForeignKey(s => s.ServiceCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Service Configuration
            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Title).IsRequired().HasMaxLength(200);
                entity.Property(s => s.Description).HasMaxLength(1000);
                entity.Property(s => s.MinPrice).HasColumnType("decimal(18,2)");
                entity.Property(s => s.MaxPrice).HasColumnType("decimal(18,2)");
                entity.Property(s => s.Location).HasMaxLength(200);
                entity.Property(s => s.Area).HasMaxLength(100);

                entity.HasMany(s => s.ServiceRequests)
                    .WithOne(sr => sr.Service)
                    .HasForeignKey(sr => sr.ServiceId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ServiceRequest Configuration
            modelBuilder.Entity<ServiceRequest>(entity =>
            {
                entity.HasKey(sr => sr.Id);
                entity.Property(sr => sr.Description).HasMaxLength(1000);
                entity.Property(sr => sr.Location).HasMaxLength(200);
                entity.Property(sr => sr.CustomerNotes).HasMaxLength(500);
                entity.Property(sr => sr.ProviderNotes).HasMaxLength(500);
                entity.Property(sr => sr.QuotedPrice).HasColumnType("decimal(18,2)");
                entity.Property(sr => sr.Status).HasConversion<string>();

                entity.HasOne(sr => sr.Review)
                    .WithOne(r => r.ServiceRequest)
                    .HasForeignKey<Review>(r => r.ServiceRequestId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Review Configuration
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Rating).IsRequired();
                entity.Property(r => r.Comment).HasMaxLength(1000);

                entity.HasCheckConstraint("CK_Review_Rating", "[Rating] >= 1 AND [Rating] <= 5");
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
