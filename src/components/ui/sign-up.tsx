"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { User, Briefcase, ArrowLeft } from "lucide-react"

const SignUp = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [userType, setUserType] = useState<"customer" | "worker">("customer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  // Check if user type is specified in URL (e.g., /signup?type=worker)
  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "worker" || type === "customer") {
      setUserType(type)
    }
  }, [searchParams])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    alert(`Sign up successful as ${userType === "customer" ? "Customer" : "Worker"}! (Demo)`)
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
          Create Your Account
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Join Karigar and get started today
        </p>

        {/* User Type Selection */}
        <div className="w-full mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            I want to sign up as:
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

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Full Name"
              type="text"
              value={name}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white border border-gray-200 transition-all"
              onChange={(e) => setName(e.target.value)}
            />
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
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white border border-gray-200 transition-all"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <div className="text-sm text-red-500 text-left bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>

          <hr className="opacity-20" />

          <div>
            <button
              onClick={handleSignUp}
              className="w-full bg-primary text-white font-medium px-5 py-3 rounded-full shadow-sm hover:bg-[#059669] transition-colors mb-3 text-sm"
            >
              Sign Up
            </button>

            {/* Google Sign Up */}
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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-[#059669] font-medium underline underline-offset-2"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { SignUp }

