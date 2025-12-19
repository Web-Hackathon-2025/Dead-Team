import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services/api'
import { LoginRequest, UserResponse } from '@/types/api.types'

export type UserType = 'customer' | 'worker'

export interface User {
  id: string
  name: string
  email: string
  type: UserType
  profileId?: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, userType: UserType) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Map backend user type to frontend user type
const mapUserType = (role: string): UserType => {
  if (role.toLowerCase().includes('customer')) return 'customer'
  if (role.toLowerCase().includes('serviceprovider') || role.toLowerCase().includes('provider')) return 'worker'
  return 'customer' // default
}

// Convert backend UserResponse to frontend User
const convertToUser = (userResponse: UserResponse): User => {
  return {
    id: userResponse.id,
    name: userResponse.fullName,
    email: userResponse.email,
    type: mapUserType(userResponse.role),
    profileId: userResponse.profileId,
    role: userResponse.role
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          setUser(convertToUser(currentUser))
        }
      } catch (error) {
        console.error('Error loading user:', error)
        authService.logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Map frontend user type to backend user type
      const backendUserType = userType === 'customer' ? 'Customer' : 'ServiceProvider'
      
      const loginRequest: LoginRequest = {
        email,
        password,
        userType: backendUserType as any
      }

      const response = await authService.login(loginRequest)
      
      // Convert and set user
      const userData = convertToUser(response.user)
      setUser(userData)
      
      return true
    } catch (error: any) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export demo credentials for display purposes
// Note: These are for UI display only, actual authentication is done via backend
export const HARDCODED_CREDENTIALS = {
  customer: {
    email: 'customer@karigar.com',
    password: 'Customer123!'
  },
  worker: {
    email: 'worker@karigar.com',
    password: 'Worker123!'
  }
}

