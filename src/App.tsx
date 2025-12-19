import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ContactPage from './pages/ContactPage'
import CustomerDashboard from './pages/CustomerDashboard'
import ServiceProviderDashboard from './pages/ServiceProviderDashboard'
import ServicesPage from './pages/ServicesPage'
import ProtectedRoute from './components/ProtectedRoute'
import { HelpChat } from './components/HelpChat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route 
          path="/dashboard/customer" 
          element={
            <ProtectedRoute requiredType="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/provider" 
          element={
            <ProtectedRoute requiredType="worker">
              <ServiceProviderDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <HelpChat />
    </BrowserRouter>
  )
}

export default App

