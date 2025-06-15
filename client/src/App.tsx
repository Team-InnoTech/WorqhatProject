// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Login from '../../client/src/Pages/login'
import Register from '../../client/src/Pages/Register'
import Dashboard from '../../client/src/Pages/Dashboard'

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
