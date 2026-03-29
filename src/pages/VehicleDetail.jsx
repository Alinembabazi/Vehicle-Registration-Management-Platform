import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchTabContent = async (tab) => {
    const res = await api.get(`/vehicle/${id}/${tab}`);
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id, activeTab],
    queryFn: () => fetchTabContent(activeTab),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/vehicle/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Vehicle deleted successfully');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to delete vehicle');
    }
  });

  const renderInfoTab = (info) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Manufacture" value={info.manufacture} />
      <DetailItem label="Model" value={info.model} />
      <DetailItem label="Year" value={info.year} />
      <DetailItem label="Vehicle Type" value={info.vehicleType} />
      <DetailItem label="Fuel Type" value={info.fuelType} />
      <DetailItem label="Body Type" value={info.bodyType} />
      <DetailItem label="Color" value={info.color} />
      <DetailItem label="Engine Capacity" value={`${info.engineCapacity} cc`} />
      <DetailItem label="Seating Capacity" value={info.seatingCapacity} />
      <DetailItem label="Odometer" value={`${info.odometerReading} km`} />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
        <div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.status==='NEW'?'bg-emerald-100 text-emerald-800':info.status==='USED'?'bg-amber-100 text-amber-800':'bg-slate-100 text-slate-800'}`}>
            {info.status}
          </span>
        </div>
      </div>
      <DetailItem label="Purpose" value={info.purpose} />
    </div>
  );

  const renderOwnerTab = (owner) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Owner Name" value={owner.ownerName} />
      <DetailItem label="Owner Type" value={owner.ownerType} />
      <DetailItem label="National ID" value={owner.nationalId} />
      <DetailItem label="Mobile" value={owner.mobile} />
      <DetailItem label="Email" value={owner.email} />
      <DetailItem label="Address" value={owner.address} />
      {owner.companyRegNumber && <DetailItem label="Company Reg" value={owner.companyRegNumber} />}
      {owner.passportNumber && <DetailItem label="Passport #" value={owner.passportNumber} />}
    </div>
  );

  const renderRegistrationTab = (reg) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Plate Number" value={reg.plateNumber} />
      <DetailItem label="Plate Type" value={reg.plateType} />
      <DetailItem label="Registration Date" value={new Date(reg.registrationDate).toLocaleDateString()} />
      <DetailItem label="Expiry Date" value={new Date(reg.expiryDate).toLocaleDateString()} />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
        <div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${reg.registrationStatus==='ACTIVE'?'bg-emerald-100 text-emerald-800':'bg-red-100 text-red-800'}`}>
            {reg.registrationStatus}
          </span>
        </div>
      </div>
      <DetailItem label="Customs Ref" value={reg.customsRef} />
      <DetailItem label="Proof of Ownership" value={reg.proofOfOwnership} />
      <DetailItem label="Roadworthy Cert" value={reg.roadworthyCert} />
    </div>
  );

  const renderInsuranceTab = (ins) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Policy Number" value={ins.policyNumber} />
      <DetailItem label="Company Name" value={ins.companyName} />
      <DetailItem label="Insurance Type" value={ins.insuranceType} />
      <DetailItem label="Expiry Date" value={new Date(ins.insuranceExpiryDate).toLocaleDateString()} />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
        <div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ins.insuranceStatus==='ACTIVE'?'bg-emerald-100 text-emerald-800':'bg-red-100 text-red-800'}`}>
            {ins.insuranceStatus}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Detail</h1>
          <p className="text-gray-500 mt-1">Manage details, view info, and update records</p>
        </div>
        <div className="flex gap-3">
          <Link to={`/vehicle/${id}/edit`} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer">
            Edit Vehicle
          </Link>
          <button onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors cursor-pointer">
            Delete Vehicle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 px-6">
          {['info', 'owner', 'registration', 'insurance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-semibold border-b-2 text-[15px] transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="p-8">
          {isLoading && <div className="flex justify-center py-10 text-gray-500 font-medium animate-pulse">⏳ Loading {activeTab} details...</div>}
          {isError && <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">❌ Found no data or error occurred.</div>}
          
          {data && !isLoading && !isError && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              {activeTab === 'info' && renderInfoTab(data)}
              {activeTab === 'owner' && renderOwnerTab(data)}
              {activeTab === 'registration' && renderRegistrationTab(data)}
              {activeTab === 'insurance' && renderInsuranceTab(data)}
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-[slideUp_0.2s_ease-out]">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Vehicle?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-70" 
                onClick={() => deleteMutation.mutate()} 
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-medium text-gray-900">{value || '-'}</span>
    </div>
  );
}