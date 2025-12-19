"use client"

import * as React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Briefcase, ArrowLeft } from "lucide-react"
import { useAuth, HARDCODED_CREDENTIALS } from "../../contexts/AuthContext"

const SignIn = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [userType, setUserType] = useState<"customer" | "worker">("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const success = await login(email, password, userType)
      
      if (success) {
        // Redirect to appropriate dashboard
        if (userType === "customer") {
          navigate("/dashboard/customer")
        } else {
          navigate("/dashboard/provider")
        }
      } else {
        setError("Invalid email or password. Please check your credentials.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Go Back Button - Outside card */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </button>
      </div>

      {/* Centered card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white shadow-xl border border-gray-100 p-8 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Sign in to your Karigar account
        </p>

        {/* User Type Selection */}
        <div className="w-full mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            I am signing in as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUserType("customer")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                userType === "customer"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <User size={20} />
              <span className="font-medium">Customer</span>
            </button>
            <button
              onClick={() => setUserType("worker")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                userType === "worker"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <Briefcase size={20} />
              <span className="font-medium">Worker</span>
            </button>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Customer:</strong> {HARDCODED_CREDENTIALS.customer.email} / {HARDCODED_CREDENTIALS.customer.password}</p>
            <p><strong>Worker:</strong> {HARDCODED_CREDENTIALS.worker.email} / {HARDCODED_CREDENTIALS.worker.password}</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white border border-gray-200 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white border border-gray-200 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-sm text-red-500 text-left bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-primary hover:text-[#059669] font-medium"
            >
              Forgot password?
            </a>
          </div>

          <hr className="opacity-20" />

          <div>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-primary text-white font-medium px-5 py-3 rounded-full shadow-sm hover:bg-[#059669] transition-colors mb-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Google Sign In */}
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full px-5 py-3 font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition mb-4 text-sm">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="w-full text-center">
              <span className="text-xs text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-[#059669] font-medium underline underline-offset-2"
                >
                  Sign up, it&apos;s free!
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { SignIn }

