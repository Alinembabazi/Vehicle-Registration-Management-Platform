import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🚗 VehicleMS</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/vehicle/new">Register Vehicle</Link>
            <button onClick={handleLogout} className="btn btn-white">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn btn-white">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
