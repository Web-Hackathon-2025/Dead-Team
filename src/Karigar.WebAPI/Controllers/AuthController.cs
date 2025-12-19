using Karigar.Application.DTOs.Auth;
using Karigar.Core.Interfaces.Services.Auth;
using Karigar.Core.Models;
using Karigar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Karigar.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;

        public AuthController(
            IAuthService authService,
            UserManager<ApplicationUser> userManager,
            AppDbContext context)
        {
            _authService = authService;
            _userManager = userManager;
            _context = context;
        }

        /// <summary>
        /// Register a new customer
        /// </summary>
        [HttpPost("register/customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, token, message) = await _authService.RegisterCustomerAsync(
                request.Email,
                request.Password,
                request.FullName,
                request.PhoneNumber
            );

            if (!success)
                return BadRequest(new { message });

            // Update customer profile with additional info
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null)
            {
                var customer = _context.Customers.FirstOrDefault(c => c.UserId == user.Id);
                if (customer != null)
                {
                    customer.Address = request.Address;
                    customer.City = request.City;
                    await _context.SaveChangesAsync();
                }
            }

            var roles = await _authService.GetUserRolesAsync(user!.Id);
            var response = new AuthResponse
            {
                Success = true,
                Token = token,
                Message = message,
                UserId = user!.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Roles = roles.ToList(),
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };

            return Ok(response);
        }

        /// <summary>
        /// Register a new service provider
        /// </summary>
        [HttpPost("register/service-provider")]
        public async Task<IActionResult> RegisterServiceProvider([FromBody] RegisterServiceProviderRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, token, message) = await _authService.RegisterServiceProviderAsync(
                request.Email,
                request.Password,
                request.FullName,
                request.BusinessName
            );

            if (!success)
                return BadRequest(new { message });

            // Update service provider profile with additional info
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null)
            {
                user.PhoneNumber = request.PhoneNumber;
                await _userManager.UpdateAsync(user);

                var provider = _context.ServiceProviders.FirstOrDefault(sp => sp.UserId == user.Id);
                if (provider != null)
                {
                    provider.Skills = request.Skills;
                    provider.Address = request.Address;
                    provider.City = request.City;
                    provider.ExperienceInYears = request.ExperienceInYears;
                    provider.HourlyRate = request.HourlyRate;
                    provider.PhoneNumber = request.PhoneNumber;
                    await _context.SaveChangesAsync();
                }
            }

            var roles = await _authService.GetUserRolesAsync(user!.Id);
            var response = new AuthResponse
            {
                Success = true,
                Token = token,
                Message = message,
                UserId = user!.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Roles = roles.ToList(),
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };

            return Ok(response);
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, token, message) = await _authService.LoginAsync(request.Email, request.Password);

            if (!success)
                return Unauthorized(new { message });

            var user = await _userManager.FindByEmailAsync(request.Email);
            var roles = await _authService.GetUserRolesAsync(user!.Id);

            var response = new AuthResponse
            {
                Success = true,
                Token = token,
                Message = message,
                UserId = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                Roles = roles.ToList(),
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };

            return Ok(response);
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _authService.GetCurrentUserAsync(userId);
            if (user == null)
                return NotFound();

            var roles = await _authService.GetUserRolesAsync(userId);

            return Ok(new
            {
                userId = user.Id,
                email = user.Email,
                fullName = user.FullName,
                roles = roles
            });
        }

        /// <summary>
        /// Change password
        /// </summary>
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
            if (!result)
                return BadRequest(new { message = "Failed to change password. Check current password." });

            return Ok(new { message = "Password changed successfully" });
        }

        /// <summary>
        /// Logout
        /// </summary>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _authService.LogoutAsync(userId);
            return Ok(new { message = "Logged out successfully" });
        }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

