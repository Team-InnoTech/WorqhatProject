// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import VerifyOtp from './Pages/Verifyotp'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/verify-otp' element={<VerifyOtp/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
