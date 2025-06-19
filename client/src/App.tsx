<<<<<<< HEAD
// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import VerifyOtp from './Pages/Verifyotp'
import ForgotPassword from './Pages/ForgetPassword'
import ResetPassword from './Pages/ResetPassword'
import LandingPage from './Pages/LandingPage'

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
    </Routes>
  )
}

export default App
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Header from './components/page_comp/Header'; // adjust path if needed

function App() {
  const handleAddGoal = () => {
    // You can add modal logic or navigation here later
    console.log("Add Goal button clicked");
  };

  return (
    <Router>
      <Header onAddClick={handleAddGoal} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> 4193230a09deac9e873024856752c72559e6d002
