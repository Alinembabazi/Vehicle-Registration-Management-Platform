import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages (we'll create these next)
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterVehicle from './pages/RegisterVehicle';
import VehicleDetail from './pages/VehicleDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/vehicle/new" element={
          <ProtectedRoute><RegisterVehicle /></ProtectedRoute>
        } />
        <Route path="/vehicle/:id" element={
          <ProtectedRoute><VehicleDetail /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}