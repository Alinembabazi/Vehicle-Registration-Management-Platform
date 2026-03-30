import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getVehicles } from '../services/api';

const fetchVehicles = async () => {
return await getVehicles();
};

export default function Dashboard() {
const { data, isLoading } = useQuery({
  queryKey: ['vehicles'],
  queryFn: fetchVehicles,
});

const total = data?.length || 0;
const newVehicles = data?.filter(v => v.status === 'NEW').length || 0;
const usedVehicles = data?.filter(v => v.status === 'USED').length || 0;
const rebuilt = data?.filter(v => v.status === 'REBUILT').length || 0;

return (
  <div className="max-w-7xl mx-auto p-6 min-h-screen">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage all registered vehicles</p>
      </div>

      <Link to="/vehicle/new">
        <button className="bg-blue-950 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors cursor-pointer">
          Register Vehicle
        </button>
      </Link>
    </div>

    {isLoading ? (
      <div className="flex justify-center py-20 text-gray-500 font-medium text-lg animate-pulse">
        Loading...
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-gray-900">{newVehicles}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-gray-900">{usedVehicles}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-gray-900">{rebuilt}</div>
        </div>
      </div>
    )}

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">All Vehicles</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 border-b">#</th>
              <th className="px-6 py-4 border-b">Manufacture</th>
              <th className="px-6 py-4 border-b">Model</th>
              <th className="px-6 py-4 border-b">Year</th>
              <th className="px-6 py-4 border-b">Type</th>
              <th className="px-6 py-4 border-b">Status</th>
              <th className="px-6 py-4 border-b">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500 italic">
                  No vehicles found.
                </td>
              </tr>
            ) : (
              data.map((vehicle, index) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold">{vehicle.manufacture}</td>
                  <td className="px-6 py-4">{vehicle.model}</td>
                  <td className="px-6 py-4">{vehicle.year}</td>

                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-950 text-xs px-2 py-1 rounded-full">
                      {vehicle.vehicleType}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vehicle.status === 'NEW'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vehicle.status === 'USED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link to={`/vehicle/${vehicle.id}`}>
                        <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">
                          View
                        </button>
                      </Link>
                      <Link to={`/vehicle/${vehicle.id}/edit`}>
                        <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}
