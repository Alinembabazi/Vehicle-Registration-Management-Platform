import React from 'react';
import{Link} from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterVehicle from './pages/RegisterVehicle';
import VehicleDetail from './pages/VehicleDetail';
import EditVehicle from './pages/EditVehicle';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/vehicle/new" element={<ProtectedRoute><RegisterVehicle /></ProtectedRoute>} />
        <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetail /></ProtectedRoute>} />
        <Route path="/vehicle/:id/edit" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}