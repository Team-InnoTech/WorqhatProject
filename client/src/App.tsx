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
