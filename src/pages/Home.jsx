import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const fetchVehicles = async () => {
  const response = await api.get('/vehicle');
  return response.data;
};

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">🚗 Registered Vehicles</h1>
          <p className="page-subtitle">Public list of all registered vehicles</p>
        </div>
      </div>

      {isLoading && <div className="loading">⏳ Loading vehicles...</div>}

      {isError && (
        <div className="alert alert-error">
          ❌ Failed to load vehicles: {error.message}
        </div>
      )}

      {data && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Manufacture</th>
                <th>Model</th>
                <th>Year</th>
                <th>Type</th>
                <th>Fuel</th>
                <th>Color</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>
                    No vehicles registered yet.
                  </td>
                </tr>
              ) : (
                data.map((vehicle, index) => (
                  <tr key={vehicle.id}>
                    <td>{index + 1}</td>
                    <td><strong>{vehicle.manufacture}</strong></td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td><span className="badge badge-blue">{vehicle.vehicleType}</span></td>
                    <td>{vehicle.fuelType}</td>
                    <td>{vehicle.color}</td>
                    <td>
                      <span className={`badge ${
                        vehicle.status === 'NEW' ? 'badge-green' :
                        vehicle.status === 'USED' ? 'badge-yellow' : 'badge-gray'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}