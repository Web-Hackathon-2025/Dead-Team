using Karigar.Application.DTOs.Auth;
using Karigar.Core.Interfaces.Services.Auth;
using Karigar.Core.Models;
using Karigar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Karigar.Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            AppDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        public async Task<(bool Success, string Token, string Message)> RegisterCustomerAsync(
            string email, string password, string fullName, string phoneNumber)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    return (false, string.Empty, "User with this email already exists");
                }

                // Create user
                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = fullName,
                    PhoneNumber = phoneNumber,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    return (false, string.Empty, string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                // Assign Customer role
                await _userManager.AddToRoleAsync(user, "Customer");

                // Create Customer profile
                var customer = new Customer
                {
                    UserId = user.Id,
                    FullName = fullName,
                    PhoneNumber = phoneNumber
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                // Generate token
                var token = await GenerateJwtToken(user);

                return (true, token, "Customer registered successfully");
            }
            catch (Exception ex)
            {
                return (false, string.Empty, $"Registration failed: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Token, string Message)> RegisterServiceProviderAsync(
            string email, string password, string fullName, string businessName)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    return (false, string.Empty, "User with this email already exists");
                }

                // Create user
                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = fullName,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    return (false, string.Empty, string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                // Assign ServiceProvider role
                await _userManager.AddToRoleAsync(user, "ServiceProvider");

                // Create ServiceProvider profile
                var serviceProvider = new ServiceProvider
                {
                    UserId = user.Id,
                    BusinessName = businessName
                };
                _context.ServiceProviders.Add(serviceProvider);
                await _context.SaveChangesAsync();

                // Generate token
                var token = await GenerateJwtToken(user);

                return (true, token, "Service Provider registered successfully");
            }
            catch (Exception ex)
            {
                return (false, string.Empty, $"Registration failed: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return (false, string.Empty, "Invalid email or password");
                }

                if (!user.IsActive)
                {
                    return (false, string.Empty, "Your account has been deactivated");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        return (false, string.Empty, "Account locked due to multiple failed login attempts");
                    }
                    return (false, string.Empty, "Invalid email or password");
                }

                var token = await GenerateJwtToken(user);
                return (true, token, "Login successful");
            }
            catch (Exception ex)
            {
                return (false, string.Empty, $"Login failed: {ex.Message}");
            }
        }

        public async Task<bool> LogoutAsync(string userId)
        {
            await _signInManager.SignOutAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // In production, send this token via email
            // For now, just return success
            return true;
        }

        public async Task<ApplicationUser?> GetCurrentUserAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<IEnumerable<string>> GetUserRolesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return new List<string>();

            return await _userManager.GetRolesAsync(user);
        }

        public async Task<bool> AssignRoleAsync(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.AddToRoleAsync(user, roleName);
            return result.Succeeded;
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expiryInMinutes = int.Parse(jwtSettings["ExpiryInMinutes"] ?? "60");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("fullName", user.FullName)
            };

            // Add role claims
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

