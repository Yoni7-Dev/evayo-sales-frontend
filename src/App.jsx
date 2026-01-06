import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import Employees from './components/Employees';
import EmployeeExpenses from './components/EmployeeExpenses';
import OtherExpenses from './components/OtherExpenses';
import Login from './components/Login';
import Register from './components/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App Content with Navigation
const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  // If not authenticated, show only auth routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
            Evayo ኢቫዮ ዳቦ ቤት
          </NavLink>
          
          {/* User Info Badge - Mobile */}
          <span className="badge bg-light text-dark d-lg-none me-2">
            👤 {user?.full_name?.split(' ')[0]}
          </span>
          
          {/* Hamburger Button */}
          <button 
            className={`navbar-toggler ${isMenuOpen ? '' : 'collapsed'}`}
            type="button" 
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink 
                  className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                  to="/"
                  onClick={closeMenu}
                >
                  📊 Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                  to="/sales"
                  onClick={closeMenu}
                >
                  🛒 Sales
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                  to="/employees"
                  onClick={closeMenu}
                >
                  👥 Employees
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                  to="/employee-expenses"
                  onClick={closeMenu}
                >
                  💰 Emp. Expenses
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                  to="/other-expenses"
                  onClick={closeMenu}
                >
                  📋 Other Expenses
                </NavLink>
              </li>
            </ul>
            
            {/* User Menu */}
            <ul className="navbar-nav">
              <li className="nav-item d-none d-lg-block">
                <span className="nav-link user-info">
                  👤 {user?.full_name} 
                  <span className="badge bg-light text-dark ms-2">{user?.role}</span>
                </span>
              </li>
              <li className="nav-item d-lg-none">
                <span className="nav-link user-info-mobile">
                  <strong>👤 {user?.full_name}</strong>
                  <br />
                  <small>{user?.email}</small>
                  <br />
                  <span className="badge bg-light text-dark mt-1">{user?.role}</span>
                </span>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link logout-btn"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={closeMenu}
        ></div>
      )}

      {/* Main Content */}
      <div className="container-fluid">
        <div className="content-area">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/employee-expenses" element={<ProtectedRoute><EmployeeExpenses /></ProtectedRoute>} />
            <Route path="/other-expenses" element={<ProtectedRoute><OtherExpenses /></ProtectedRoute>} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
