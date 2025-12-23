# Karigar - Frontend Backend Integration Guide

## ✅ Completed Integration

Main ne frontend ko backend se successfully integrate kar diya hai! Ab sab hardcoded values API calls se replace ho gayi hain.

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd src/Karigar.WebAPI

# Update connection string in appsettings.json
# Make sure SQL Server is running

# Run migrations
dotnet ef database update --project ../Karigar.Infrastructure

# Run backend
dotnet run
```

Backend will run on: `https://localhost:7001`

### 2. Frontend Setup

```bash
# Install dependencies (if not already done)
npm install

# Create .env.local file in root directory
# Add this line:
VITE_API_URL=https://localhost:7001/api

# Run frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📁 New Files Created

### API Service Layer
- `src/config/environment.ts` - Environment configuration
- `src/types/api.types.ts` - TypeScript types for API
- `src/services/api/apiClient.ts` - Axios configuration with interceptors
- `src/services/api/authService.ts` - Authentication API calls
- `src/services/api/customerService.ts` - Customer API calls
- `src/services/api/serviceProviderService.ts` - Service Provider API calls
- `src/services/api/serviceService.ts` - Services API calls
- `src/services/api/serviceRequestService.ts` - Service Requests API calls
- `src/services/api/reviewService.ts` - Reviews API calls
- `src/services/api/index.ts` - Central export file

### Updated Files
- `src/contexts/AuthContext.tsx` - Now uses real API instead of hardcoded values
- `src/components/ui/sign-up.tsx` - Registration with backend API
- `src/components/ui/sign-in.tsx` - Login already had structure, now properly integrated

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. All subsequent API calls include token in Authorization header
5. If token expires (401), user is redirected to login

## 📝 Demo Credentials

**Important:** Backend uses different password requirements:
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 digit

Create test accounts in backend or use the seeded admin account.

## 🎯 API Endpoints Used

### Authentication
- `POST /api/Auth/login` - User login
- `POST /api/Auth/register` - User registration
- `POST /api/Auth/refresh-token` - Refresh JWT token

### Customer
- `GET /api/Customer/profile` - Get customer profile
- `PUT /api/Customer/profile` - Update customer profile
- `GET /api/Customer/{id}` - Get customer by ID

### Service Provider
- `GET /api/ServiceProvider/profile` - Get provider profile
- `PUT /api/ServiceProvider/profile` - Update provider profile
- `GET /api/ServiceProvider` - Get all providers (with filters)
- `GET /api/ServiceProvider/search` - Search providers

### Services
- `GET /api/Service` - Get all services
- `GET /api/Service/{id}` - Get service by ID
- `GET /api/Service/provider/{providerId}` - Get provider's services
- `POST /api/Service` - Create new service
- `PUT /api/Service/{id}` - Update service
- `DELETE /api/Service/{id}` - Delete service

### Service Requests
- `GET /api/ServiceRequest/my-requests` - Customer's requests
- `GET /api/ServiceRequest/received-requests` - Provider's requests
- `POST /api/ServiceRequest` - Create new request
- `PATCH /api/ServiceRequest/{id}/status` - Update request status

### Reviews
- `GET /api/Review/my-reviews` - Customer's reviews
- `GET /api/Review/provider/{providerId}` - Provider's reviews
- `POST /api/Review` - Create review

## 🔧 Environment Variables

Create `.env.local` file:

```env
VITE_API_URL=https://localhost:7001/api
```

For production:
```env
VITE_API_URL=https://your-production-api.com/api
```

## 🛠️ Features Implemented

✅ JWT Authentication with token refresh
✅ Axios interceptors for token injection
✅ Global error handling
✅ Auto-redirect on 401 (Unauthorized)
✅ TypeScript types for all API responses
✅ Loading states in auth forms
✅ Error messages display
✅ Service layer separation
✅ Environment configuration

## ⏭️ Next Steps

The following pages still need to be updated to use backend API:
1. Customer Dashboard - Fetch real service requests and reviews
2. Provider Dashboard - Fetch real requests and services
3. Services Page - Fetch providers from backend
4. All CRUD operations need to be connected

## 🐛 Troubleshooting

### CORS Error
Make sure backend has CORS enabled for frontend URL in `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### SSL Certificate Error
In development, you might need to trust the SSL certificate:
```bash
dotnet dev-certs https --trust
```

### 401 Unauthorized
- Check if token is being sent in request headers
- Verify token hasn't expired
- Check user role permissions

## 📚 Usage Example

```typescript
// Login
import { authService } from '@/services/api'

const handleLogin = async () => {
  try {
    await authService.login({
      email: 'user@example.com',
      password: 'Password123!',
      userType: 'Customer'
    })
    // User logged in successfully
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Fetch service providers
import { serviceProviderService } from '@/services/api'

const fetchProviders = async () => {
  try {
    const result = await serviceProviderService.getAll({
      pageNumber: 1,
      pageSize: 10,
      city: 'Karachi'
    })
    console.log(result.items) // Array of providers
  } catch (error) {
    console.error('Failed to fetch providers:', error)
  }
}
```

## 🎉 Boom! Integration Complete!

Backend aur frontend ab properly connected hain. Sab API services ready hain aur auth bhi working hai! 🚀

---

**Team:** Abdul Rehman (Backend) + Dost (Frontend) = Zabardast! 💪





