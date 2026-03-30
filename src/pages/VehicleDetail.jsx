import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getVehicleByTab, deleteVehicle } from '../services/api'; // ✅ fixed

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id, activeTab],
    queryFn: () => getVehicleByTab(id, activeTab),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
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
      <DetailItem label="Purpose" value={info.purpose} />
      <div>
        <span className="text-xs text-gray-500">Status</span>
        <div>{info.status}</div>
      </div>
    </div>
  );

  const renderOwnerTab = (owner) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Owner Name" value={owner.ownerName} />
      <DetailItem label="Mobile" value={owner.mobile} />
      <DetailItem label="Email" value={owner.email} />
      {owner.nationalId && <DetailItem label="National ID" value={owner.nationalId} />}
      {owner.passportNumber && <DetailItem label="Passport #" value={owner.passportNumber} />}
      {owner.companyRegNumber && <DetailItem label="Company Reg #" value={owner.companyRegNumber} />}
      {owner.address && <DetailItem label="Address" value={owner.address} />}
    </div>
  );

  const renderRegistrationTab = (reg) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Plate Number" value={reg.plateNumber} />
      <DetailItem label="Plate Type" value={reg.plateType} />
      <DetailItem label="Registration Date" value={new Date(reg.registrationDate).toLocaleDateString()} />
      <DetailItem label="Expiry Date" value={new Date(reg.expiryDate).toLocaleDateString()} />
      <DetailItem label="Customs Ref" value={reg.customsRef} />
      <DetailItem label="Proof of Ownership" value={reg.proofOfOwnership} />
      <DetailItem label="Roadworthy Cert" value={reg.roadworthyCert} />
      <div>
        <span className="text-xs text-gray-500">Status</span>
        <div>{reg.registrationStatus}</div>
      </div>
    </div>
  );

  const renderInsuranceTab = (ins) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DetailItem label="Policy Number" value={ins.policyNumber} />
      <DetailItem label="Company Name" value={ins.companyName} />
      <DetailItem label="Insurance Type" value={ins.insuranceType} />
      <DetailItem label="Expiry Date" value={new Date(ins.insuranceExpiryDate).toLocaleDateString()} />
      <div>
        <span className="text-xs text-gray-500">Status</span>
        <div>{ins.insuranceStatus}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Vehicle Detail</h1>
        <div className="flex gap-2">
          <Link to={`/vehicle/${id}/edit`} className="border px-3 py-1 rounded hover:bg-gray-50 transition">
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {['info', 'owner', 'registration', 'insurance'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Error loading data</p>}
      {data && (
        <>
          {activeTab === 'info' && renderInfoTab(data)}
          {activeTab === 'owner' && renderOwnerTab(data)}
          {activeTab === 'registration' && renderRegistrationTab(data)}
          {activeTab === 'insurance' && renderInsuranceTab(data)}
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <p className="mb-4">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                className="border px-3 py-1 rounded hover:bg-gray-50 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-950 text-white px-3 py-1 rounded transition"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold">{value || '-'}</p>
    </div>
  );
}