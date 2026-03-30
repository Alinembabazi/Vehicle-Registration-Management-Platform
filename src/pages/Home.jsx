import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '../services/api';

const fetchVehicles = async () => {
  return await getVehicles();
};

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Registered Vehicles
          </h1>
          <p className="text-gray-500">
            Public list of all registered vehicles
          </p>
        </div>

        {isLoading && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 animate-pulse">
              Loading vehicles...
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl shadow text-center">
            Error: {error}
          </div>
        )}

        {data && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800 text-white text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Manufacture</th>
                    <th className="px-6 py-4">Model</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Fuel</th>
                    <th className="px-6 py-4">Color</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-gray-400">
                        No vehicles registered yet.
                      </td>
                    </tr>
                  ) : (
                    data.map((vehicle, index) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {vehicle.manufacture}
                        </td>
                        <td className="px-6 py-4">{vehicle.model}</td>
                        <td className="px-6 py-4">{vehicle.year}</td>

                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                            {vehicle.vehicleType}
                          </span>
                        </td>

                        <td className="px-6 py-4">{vehicle.fuelType}</td>
                        <td className="px-6 py-4">{vehicle.color}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              vehicle.status === 'NEW'
                                ? 'bg-green-100 text-green-600'
                                : vehicle.status === 'USED'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}