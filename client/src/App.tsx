// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
