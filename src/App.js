import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Events from './pages/Events';
import Savings from './pages/Savings';
import LandingPage from './pages/LandingPage';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('token=');
    setIsAuthenticated(isLoggedIn);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing Scroll Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authenticated Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/events" element={<Events />} />
        <Route path="/savings" element={<Savings />} />
        
      </Routes>
    </Router>
  );
}

export default App;
