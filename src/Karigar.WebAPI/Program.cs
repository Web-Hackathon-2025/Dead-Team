using Karigar.Application.Services.Auth;
using Karigar.Core.Interfaces.Services.Auth;
using Karigar.Core.Models;
using Karigar.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    // User settings
    options.User.RequireUniqueEmail = true;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!)),
        ClockSkew = TimeSpan.Zero
    };
});

// Register Repositories
builder.Services.AddScoped(typeof(Karigar.Core.Interfaces.Repositories.IBaseRepository<>), typeof(Karigar.Infrastructure.Repositories.BaseRepository<>));
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.Customer.ICustomerRepository, Karigar.Infrastructure.Repositories.Customer.CustomerRepository>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.ServiceProvider.IServiceProviderRepository, Karigar.Infrastructure.Repositories.ServiceProvider.ServiceProviderRepository>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.Admin.IAdminRepository, Karigar.Infrastructure.Repositories.Admin.AdminRepository>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.Service.IServiceRepository, Karigar.Infrastructure.Repositories.Service.ServiceRepository>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.ServiceCategory.IServiceCategoryRepository, Karigar.Infrastructure.Repositories.ServiceCategory.ServiceCategoryRepository>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.ServiceRequest.IServiceRequestRepository, Karigar.Infrastructure.Repositories.ServiceRequest.ServiceRequestRepository>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Repositories.Review.IReviewRepository, Karigar.Infrastructure.Repositories.Review.ReviewRepository>();

// Register Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.Customer.ICustomerService, Karigar.Application.Services.Customer.CustomerService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.ServiceProvider.IServiceProviderService, Karigar.Application.Services.ServiceProvider.ServiceProviderService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.Admin.IAdminService, Karigar.Application.Services.Admin.AdminService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.ServiceCategory.IServiceCategoryService, Karigar.Application.Services.ServiceCategory.ServiceCategoryService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.Service.IServiceService, Karigar.Application.Services.Service.ServiceService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.ServiceRequest.IServiceRequestService, Karigar.Application.Services.ServiceRequest.ServiceRequestService>();
builder.Services.AddScoped<Karigar.Core.Interfaces.Services.Review.IReviewService, Karigar.Application.Services.Review.ReviewService>();

// Add Controllers
builder.Services.AddControllers();

// Add Swagger with JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Karigar API",
        Version = "v1",
        Description = "Karigar - Hyperlocal Services Marketplace API",
        Contact = new OpenApiContact
        {
            Name = "Karigar Team",
            Email = "support@karigar.com"
        }
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Seed Database with Roles and Admin User
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await DbSeeder.SeedRolesAndAdminAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Karigar API V1");
        c.RoutePrefix = string.Empty; 
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
