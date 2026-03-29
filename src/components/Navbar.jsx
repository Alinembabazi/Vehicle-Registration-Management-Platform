import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">VehicleMS</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-blue-100 hover:text-white font-medium transition-colors">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-blue-100 hover:text-white font-medium transition-colors">Dashboard</Link>
            <Link to="/vehicle/new" className="text-blue-100 hover:text-white font-medium transition-colors">Register Vehicle</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}