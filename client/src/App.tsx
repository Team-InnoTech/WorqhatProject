// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import VerifyOtp from './Pages/Verifyotp'
import ForgotPassword from './Pages/ForgetPassword'
import ResetPassword from './Pages/ResetPassword'
import LandingPage from './Pages/LandingPage'
import Predict from './Pages/Predict'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/forget-password' element={<ForgotPassword />} />
      <Route path='/verify-otp' element={<VerifyOtp/>} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/predict' element={<Predict />}/>
    </Routes>
  )
}

export default App
