using Karigar.Application.DTOs.Auth;
using Karigar.Core.Interfaces.Services.Auth;
using Karigar.Core.Models;
using Karigar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            AppDbContext context,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
            _logger = logger;
        }

        public async Task<(bool Success, string Token, string Message)> RegisterCustomerAsync(
            string email, string password, string fullName, string phoneNumber)
        {
            _logger.LogInformation("Attempting to register customer with email: {Email}", email);
            
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed - User already exists: {Email}", email);
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
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogError("Failed to create user {Email}: {Errors}", email, errors);
                    return (false, string.Empty, errors);
                }

                // Assign Customer role
                await _userManager.AddToRoleAsync(user, "Customer");
                _logger.LogInformation("Customer role assigned to user: {Email}", email);

                // Create Customer profile
                var customer = new Core.Models.Customer
                {
                    UserId = user.Id,
                    FullName = fullName,
                    PhoneNumber = phoneNumber
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Customer profile created for user: {Email}", email);

                // Generate token
                var token = await GenerateJwtToken(user);

                _logger.LogInformation("Customer registration completed successfully: {Email}", email);
                return (true, token, "Customer registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering customer: {Email}", email);
                return (false, string.Empty, $"Registration failed: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Token, string Message)> RegisterServiceProviderAsync(
            string email, string password, string fullName, string businessName)
        {
            _logger.LogInformation("Attempting to register service provider with email: {Email}, Business: {BusinessName}", email, businessName);
            
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed - User already exists: {Email}", email);
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
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogError("Failed to create service provider user {Email}: {Errors}", email, errors);
                    return (false, string.Empty, errors);
                }

                // Assign ServiceProvider role
                await _userManager.AddToRoleAsync(user, "ServiceProvider");
                _logger.LogInformation("ServiceProvider role assigned to user: {Email}", email);

                // Create ServiceProvider profile
                var serviceProvider = new Core.Models.ServiceProvider
                {
                    UserId = user.Id,
                    BusinessName = businessName
                };
                _context.ServiceProviders.Add(serviceProvider);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("ServiceProvider profile created for: {Email}, Business: {BusinessName}", email, businessName);

                // Generate token
                var token = await GenerateJwtToken(user);

                _logger.LogInformation("Service Provider registration completed successfully: {Email}", email);
                return (true, token, "Service Provider registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering service provider: {Email}", email);
                return (false, string.Empty, $"Registration failed: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password)
        {
            _logger.LogInformation("Login attempt for email: {Email}", email);
            
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    _logger.LogWarning("Login failed - User not found: {Email}", email);
                    return (false, string.Empty, "Invalid email or password");
                }

                if (!user.IsActive)
                {
                    _logger.LogWarning("Login failed - Account deactivated: {Email}", email);
                    return (false, string.Empty, "Your account has been deactivated");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        _logger.LogWarning("Login failed - Account locked out: {Email}", email);
                        return (false, string.Empty, "Account locked due to multiple failed login attempts");
                    }
                    _logger.LogWarning("Login failed - Invalid credentials: {Email}", email);
                    return (false, string.Empty, "Invalid email or password");
                }

                var token = await GenerateJwtToken(user);
                _logger.LogInformation("Login successful for: {Email}", email);
                return (true, token, "Login successful");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login for: {Email}", email);
                return (false, string.Empty, $"Login failed: {ex.Message}");
            }
        }

        public async Task<bool> LogoutAsync(string userId)
        {
            try
            {
                _logger.LogInformation("Logout initiated for user: {UserId}", userId);
                await _signInManager.SignOutAsync();
                _logger.LogInformation("Logout successful for user: {UserId}", userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during logout for user: {UserId}", userId);
                return false;
            }
        }

        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            _logger.LogInformation("Password change attempt for user: {UserId}", userId);
            
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("Password change failed - User not found: {UserId}", userId);
                    return false;
                }

                var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Password changed successfully for user: {UserId}", userId);
                }
                else
                {
                    _logger.LogWarning("Password change failed for user: {UserId}", userId);
                }
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during password change for user: {UserId}", userId);
                return false;
            }
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            _logger.LogInformation("Password reset requested for: {Email}", email);
            
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    _logger.LogWarning("Password reset failed - User not found: {Email}", email);
                    return false;
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                _logger.LogInformation("Password reset token generated for: {Email}", email);
                // In production, send this token via email
                // For now, just return success
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during password reset for: {Email}", email);
                return false;
            }
        }

        public async Task<ApplicationUser?> GetCurrentUserAsync(string userId)
        {
            try
            {
                _logger.LogDebug("Fetching user details for: {UserId}", userId);
                return await _userManager.FindByIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching user: {UserId}", userId);
                return null;
            }
        }

        public async Task<IEnumerable<string>> GetUserRolesAsync(string userId)
        {
            try
            {
                _logger.LogDebug("Fetching roles for user: {UserId}", userId);
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User not found while fetching roles: {UserId}", userId);
                    return new List<string>();
                }

                return await _userManager.GetRolesAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching roles for user: {UserId}", userId);
                return new List<string>();
            }
        }

        public async Task<bool> AssignRoleAsync(string userId, string roleName)
        {
            _logger.LogInformation("Attempting to assign role {Role} to user: {UserId}", roleName, userId);
            
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("Role assignment failed - User not found: {UserId}", userId);
                    return false;
                }

                var result = await _userManager.AddToRoleAsync(user, roleName);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Role {Role} assigned successfully to user: {UserId}", roleName, userId);
                }
                else
                {
                    _logger.LogWarning("Failed to assign role {Role} to user: {UserId}", roleName, userId);
                }
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while assigning role {Role} to user: {UserId}", roleName, userId);
                return false;
            }
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

