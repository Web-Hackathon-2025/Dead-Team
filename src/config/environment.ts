// Environment configuration
export const config = {
  // API Base URL - Update this to your backend URL
  apiUrl: import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
  
  // JWT Token Key
  tokenKey: 'karigar_token',
  
  // User Key
  userKey: 'karigar_user',
  
  // Refresh Token Key
  refreshTokenKey: 'karigar_refresh_token',
} as const

export default config

