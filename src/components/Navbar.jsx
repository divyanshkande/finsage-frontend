import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Finsage</Link>
      </div>

      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        <Link to="/about" className="hover:text-yellow-400">About</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            <Link to="/expenses" className="hover:text-yellow-400">Expenses</Link>
            <Link to="/events" className="hover:text-yellow-400">Events</Link>
            <Link to="/savings" className="hover:text-yellow-400">Savings</Link>
            
            
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-gray-300">Register / Login</Link>

          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
