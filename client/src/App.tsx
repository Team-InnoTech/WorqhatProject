// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import VerifyOtp from './Pages/Verifyotp'
import ForgotPassword from './Pages/ForgetPassword'
import ResetPassword from './Pages/ResetPassword'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/forget-password' element={<ForgotPassword />} />
      <Route path='/verify-otp' element={<VerifyOtp/>} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
