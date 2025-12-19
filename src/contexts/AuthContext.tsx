import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserType = 'customer' | 'worker'

export interface User {
  id: string
  name: string
  email: string
  type: UserType
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, userType: UserType) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded credentials
const HARDCODED_USERS = {
  customer: [
    {
      id: '1',
      name: 'John Doe',
      email: 'customer@karigar.com',
      password: 'customer123',
      type: 'customer' as UserType
    }
  ],
  worker: [
    {
      id: '2',
      name: 'Ahmed Plumbing Services',
      email: 'worker@karigar.com',
      password: 'worker123',
      type: 'worker' as UserType
    }
  ]
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('karigar_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        localStorage.removeItem('karigar_user')
      }
    }
  }, [])

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = HARDCODED_USERS[userType]
    const foundUser = users.find(u => u.email === email && u.password === password)

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        type: foundUser.type
      }
      setUser(userData)
      localStorage.setItem('karigar_user', JSON.stringify(userData))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('karigar_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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

// Export hardcoded credentials for display
export const HARDCODED_CREDENTIALS = {
  customer: {
    email: 'customer@karigar.com',
    password: 'customer123'
  },
  worker: {
    email: 'worker@karigar.com',
    password: 'worker123'
  }
}

