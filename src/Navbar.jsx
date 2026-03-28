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
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">🚗 VehicleMS</Link>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/vehicle/new" className="hover:underline">Register Vehicle</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 px-3 py-1 rounded font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-blue-700 px-3 py-1 rounded font-semibold hover:bg-gray-100">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}