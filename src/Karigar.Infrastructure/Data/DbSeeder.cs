using Karigar.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Karigar.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Define roles for Karigar application
            string[] roles = { "Admin", "Customer", "ServiceProvider" };

            // Create roles if they don't exist
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var result = await roleManager.CreateAsync(new IdentityRole(role));
                    if (result.Succeeded)
                    {
                        Console.WriteLine($"Role '{role}' created successfully.");
                    }
                }
            }

            // Create default admin user
            var adminEmail = "admin@karigar.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    
                    // Create Admin profile
                    var dbContext = serviceProvider.GetRequiredService<AppDbContext>();
                    var adminProfile = new Admin
                    {
                        UserId = adminUser.Id,
                        FullName = "System Administrator",
                        CanManageUsers = true,
                        CanManageServices = true,
                        CanManageReviews = true,
                        CanViewReports = true
                    };
                    dbContext.Admins.Add(adminProfile);
                    await dbContext.SaveChangesAsync();

                    Console.WriteLine($"Admin user created: {adminEmail} / Admin@123");
                }
                else
                {
                    Console.WriteLine($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}

