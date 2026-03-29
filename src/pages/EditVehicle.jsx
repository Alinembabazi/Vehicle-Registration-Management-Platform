import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    manufacture: '',
    model: '',
    year: '',
    plateNumber: '',
    ownerName: '',
    mobile: ''
  });

  // Instead of risking bad data from the 4 tabs, we fetch the exact raw payload from the universal GET endpoint!
  const fetchFlatVehicle = async () => {
    const res = await api.get('/vehicle');
    // Find our vehicle from the flat array list returned by backend
    const exactVehicle = res.data.find(v => v.id === id);
    if (!exactVehicle) throw new Error("Vehicle not found");
    return exactVehicle;
  };

  const { data: fullData, isLoading } = useQuery({
    queryKey: ['vehicleEditFlat', id],
    queryFn: fetchFlatVehicle,
  });

  useEffect(() => {
    if (fullData) {
      setFormData({
        manufacture: fullData.manufacture || '',
        model: fullData.model || '',
        year: fullData.year || '',
        plateNumber: fullData.plateNumber || '',
        ownerName: fullData.ownerName || '',
        mobile: fullData.mobile || ''
      });
    }
  }, [fullData]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => api.put(`/vehicle/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle updated successfully!');
      navigate(`/vehicle/${id}`);
    },
    onError: (err) => {
      console.error("API Error details:", err.response?.data);
      toast.error(err.response?.data?.message || 'Update failed due to server error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare exactly the same 34-field payload that works!
    const updatedPayload = {
      ...fullData,
      ...formData,
      year: parseInt(formData.year, 10)
    };

    // CRUCIAL: Remove database-managed fields (id,createdAt,updatedAt). The API throws a strict 500 error if you try to UPDATE these!
    delete updatedPayload.id;
    delete updatedPayload.createdAt;
    delete updatedPayload.updatedAt;

    mutate(updatedPayload);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20 animate-pulse text-gray-500 font-medium">⏳ Fetching vehicle details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="bg-white p-8 shadow-sm border border-gray-200 rounded-xl animate-[fadeIn_0.3s_ease-out]">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Vehicle Details</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Update the simplified details of the vehicle.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                value={formData.manufacture}
                onChange={e => setFormData({...formData, manufacture: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input required type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                value={formData.plateNumber}
                onChange={e => setFormData({...formData, plateNumber: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                value={formData.ownerName}
                onChange={e => setFormData({...formData, ownerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Mobile (10 digits)</label>
              <input required type="text" pattern="\d{10}" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4">
            <button 
              type="button" 
              onClick={() => navigate(`/vehicle/${id}`)}
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {isPending ? 'Saving Update...' : 'Update Vehicle ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
